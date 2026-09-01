begin;

create or replace function public.create_claim_grid_session(
    input_name text,
    input_team_count smallint,
    input_question_timer smallint,
    input_team_colors text[],
    input_questions jsonb,
    input_set_id bigint default null
)
returns public.claim_grid_sessions
language plpgsql
security definer
set search_path = ''
as $function$
declare
    current_user_id uuid := auth.uid();
    clean_name text := trim(input_name);
    generated_code text;
    board_size smallint;
    saved_session public.claim_grid_sessions;
    saved_question public.claim_grid_session_questions;
    question_record record;
    choice_record record;
    question_text_value text;
    question_item_value bigint;
    answer_text_value text;
    answer_item_value bigint;
    choice_count integer;
    correct_count integer;
    team_number_value smallint;
    row_value smallint;
    column_value smallint;
begin
    if current_user_id is null
       or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
        raise exception 'Log in with a regular account to create a Claim the Grid room.';
    end if;

    if clean_name = '' or char_length(clean_name) > 80 then
        raise exception 'Enter a game name of 1 to 80 characters.';
    end if;

    if input_team_count not between 2 and 4 then
        raise exception 'Choose between 2 and 4 teams.';
    end if;

    if input_question_timer not in (3, 5, 7, 10, 15) then
        raise exception 'Choose a valid game duration.';
    end if;

    if input_team_colors is null
       or cardinality(input_team_colors) <> input_team_count then
        raise exception 'Choose one color for each team.';
    end if;

    if exists (
        select 1
        from unnest(input_team_colors) as color(value)
        where value !~ '^#[0-9A-Fa-f]{6}$'
    ) then
        raise exception 'One or more team colors are invalid.';
    end if;

    if (
        select count(distinct lower(value))
        from unnest(input_team_colors) as color(value)
    ) <> input_team_count then
        raise exception 'Choose a different color for each team.';
    end if;

    if input_questions is null
       or jsonb_typeof(input_questions) <> 'array'
       or jsonb_array_length(input_questions) not between 3 and 50 then
        raise exception 'A game must contain between 3 and 50 questions.';
    end if;

    if input_set_id is not null and not exists (
        select 1
        from public.claim_grid_sets
        where id = input_set_id
          and owner_id = current_user_id
          and active = true
    ) then
        raise exception 'That saved Claim the Grid Set is not available.';
    end if;

    board_size := case
        when input_team_count = 2 then 7
        else 9
    end;

    loop
        generated_code := upper(substr(md5(
            clock_timestamp()::text || random()::text || current_user_id::text
        ), 1, 6));
        exit when not exists (
            select 1
            from public.claim_grid_sessions
            where room_code = generated_code
              and expires_at > now()
        );
    end loop;

    insert into public.claim_grid_sessions (
        host_id,
        source_set_id,
        room_code,
        name,
        team_count,
        game_duration_minutes,
        team_colors,
        grid_size
    )
    values (
        current_user_id,
        input_set_id,
        generated_code,
        clean_name,
        input_team_count,
        input_question_timer,
        input_team_colors,
        board_size
    )
    returning * into saved_session;

    for team_number_value in 1..input_team_count loop
        insert into public.claim_grid_teams (
            session_id,
            team_number,
            color
        ) values (
            saved_session.id,
            team_number_value,
            input_team_colors[team_number_value]
        );
    end loop;

    for row_value in 1..board_size loop
        for column_value in 1..board_size loop
            insert into public.claim_grid_cells (
                session_id,
                row_number,
                column_number
            ) values (
                saved_session.id,
                row_value,
                column_value
            );
        end loop;
    end loop;

    if input_team_count = 2 then
        update public.claim_grid_cells
        set owner_team_number = 1, base_team_number = 1, is_base = true
        where session_id = saved_session.id
          and row_number = ((board_size + 1) / 2)
          and column_number = 1;

        update public.claim_grid_cells
        set owner_team_number = 2, base_team_number = 2, is_base = true
        where session_id = saved_session.id
          and row_number = ((board_size + 1) / 2)
          and column_number = board_size;
    elsif input_team_count = 3 then
        update public.claim_grid_cells
        set owner_team_number = 1, base_team_number = 1, is_base = true
        where session_id = saved_session.id
          and row_number = 1
          and column_number = ((board_size + 1) / 2);

        update public.claim_grid_cells
        set owner_team_number = 2, base_team_number = 2, is_base = true
        where session_id = saved_session.id
          and row_number = board_size
          and column_number = 1;

        update public.claim_grid_cells
        set owner_team_number = 3, base_team_number = 3, is_base = true
        where session_id = saved_session.id
          and row_number = board_size
          and column_number = board_size;
    else
        update public.claim_grid_cells
        set owner_team_number = case
                when row_number = 1 and column_number = 1 then 1
                when row_number = 1 and column_number = board_size then 2
                when row_number = board_size and column_number = 1 then 3
                else 4
            end,
            base_team_number = case
                when row_number = 1 and column_number = 1 then 1
                when row_number = 1 and column_number = board_size then 2
                when row_number = board_size and column_number = 1 then 3
                else 4
            end,
            is_base = true
        where session_id = saved_session.id
          and (row_number, column_number) in (
              (1, 1),
              (1, board_size),
              (board_size, 1),
              (board_size, board_size)
          );
    end if;

    for question_record in
        select value, ordinality
        from jsonb_array_elements(input_questions) with ordinality
    loop
        question_text_value := nullif(trim(question_record.value ->> 'question_text'), '');
        question_item_value := nullif(question_record.value ->> 'question_item_id', '')::bigint;

        if question_text_value is null and question_item_value is null then
            raise exception 'Question % needs text or an image.', question_record.ordinality;
        end if;

        if char_length(question_text_value) > 300 then
            raise exception 'Question % text is too long.', question_record.ordinality;
        end if;

        if question_item_value is not null and not exists (
            select 1 from public.items
            where id = question_item_value and active = true and image_url is not null
        ) then
            raise exception 'Question % uses an unavailable image.', question_record.ordinality;
        end if;

        if jsonb_typeof(question_record.value -> 'choices') <> 'array' then
            raise exception 'Question % has an invalid answer list.', question_record.ordinality;
        end if;

        choice_count := jsonb_array_length(question_record.value -> 'choices');
        if choice_count not between 2 and 4 then
            raise exception 'Question % must contain between 2 and 4 answers.', question_record.ordinality;
        end if;

        select count(*) into correct_count
        from jsonb_array_elements(question_record.value -> 'choices') as choice(value)
        where coalesce((choice.value ->> 'is_correct')::boolean, false);

        if correct_count <> 1 then
            raise exception 'Question % must have exactly one correct answer.', question_record.ordinality;
        end if;

        insert into public.claim_grid_session_questions (
            session_id, position, question_text, question_item_id
        ) values (
            saved_session.id,
            question_record.ordinality::smallint,
            question_text_value,
            question_item_value
        ) returning * into saved_question;

        for choice_record in
            select value, ordinality
            from jsonb_array_elements(question_record.value -> 'choices') with ordinality
        loop
            answer_text_value := nullif(trim(choice_record.value ->> 'answer_text'), '');
            answer_item_value := nullif(choice_record.value ->> 'answer_item_id', '')::bigint;

            if answer_text_value is null and answer_item_value is null then
                raise exception 'Answer % in question % needs text or an image.',
                    choice_record.ordinality, question_record.ordinality;
            end if;

            if char_length(answer_text_value) > 180 then
                raise exception 'Answer % in question % is too long.',
                    choice_record.ordinality, question_record.ordinality;
            end if;

            if answer_item_value is not null and not exists (
                select 1 from public.items
                where id = answer_item_value and active = true and image_url is not null
            ) then
                raise exception 'Answer % in question % uses an unavailable image.',
                    choice_record.ordinality, question_record.ordinality;
            end if;

            insert into public.claim_grid_session_choices (
                question_id, position, answer_text, answer_item_id, is_correct
            ) values (
                saved_question.id,
                choice_record.ordinality::smallint,
                answer_text_value,
                answer_item_value,
                coalesce((choice_record.value ->> 'is_correct')::boolean, false)
            );
        end loop;
    end loop;

    return saved_session;
end;
$function$;

revoke all on function public.create_claim_grid_session(
    text, smallint, smallint, text[], jsonb, bigint
) from public, anon;

grant execute on function public.create_claim_grid_session(
    text, smallint, smallint, text[], jsonb, bigint
) to authenticated;

commit;
