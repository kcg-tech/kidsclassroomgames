begin;

create or replace function public.save_claim_grid_set(
    input_name text,
    input_team_count smallint,
    input_question_timer smallint,
    input_team_colors text[],
    input_questions jsonb
)
returns public.claim_grid_sets
language plpgsql
security definer
set search_path = ''
as $function$
declare
    current_user_id uuid;
    clean_name text;
    free_limit integer;
    saved_set public.claim_grid_sets;
    saved_question public.claim_grid_questions;
    question_record record;
    choice_record record;
    question_text_value text;
    question_item_value bigint;
    answer_text_value text;
    answer_item_value bigint;
    choice_count integer;
    correct_count integer;
    question_count integer;
begin
    current_user_id := auth.uid();

    if current_user_id is null
       or coalesce(
            (auth.jwt() ->> 'is_anonymous')::boolean,
            false
       ) then
        raise exception
            'Log in with a regular account to save Claim the Grid sets.';
    end if;

    clean_name := trim(input_name);

    if clean_name = ''
       or char_length(clean_name) > 80 then
        raise exception
            'Enter a Claim the Grid Set name of 1 to 80 characters.';
    end if;

    if input_team_count not between 2 and 4 then
        raise exception
            'Choose between 2 and 4 teams.';
    end if;

    if input_question_timer not in (
        10, 20, 30, 40, 50, 60
    ) then
        raise exception
            'Choose a valid question timer.';
    end if;

    if input_team_colors is null
       or cardinality(input_team_colors) <>
        input_team_count then
        raise exception
            'Choose one color for each team.';
    end if;

    if exists (
        select 1
        from unnest(input_team_colors) as color(value)
        where value !~ '^#[0-9A-Fa-f]{6}$'
    ) then
        raise exception
            'One or more team colors are invalid.';
    end if;

    if (
        select count(distinct lower(value))
        from unnest(input_team_colors) as color(value)
    ) <> input_team_count then
        raise exception
            'Choose a different color for each team.';
    end if;

    if input_questions is null
       or jsonb_typeof(input_questions) <> 'array' then
        raise exception
            'The question list is invalid.';
    end if;

    question_count := jsonb_array_length(input_questions);

    if question_count not between 1 and 50 then
        raise exception
            'A Claim the Grid Set must contain between 1 and 50 questions.';
    end if;

    if exists (
        select 1
        from public.claim_grid_sets
        where owner_id = current_user_id
          and active = true
          and lower(trim(name)) = lower(clean_name)
    ) then
        raise exception
            'You already have a Claim the Grid Set with this name.';
    end if;

    if not public.user_has_premium() then
        free_limit := public.get_free_saved_game_limit();

        if (
            select count(*)
            from public.claim_grid_sets
            where owner_id = current_user_id
              and active = true
        ) >= free_limit then
            raise exception
                'Free accounts can save up to % Claim the Grid Sets. Delete one or upgrade to Premium.',
                free_limit;
        end if;
    end if;

    insert into public.claim_grid_sets (
        owner_id,
        name,
        team_count,
        question_timer,
        team_colors
    )
    values (
        current_user_id,
        clean_name,
        input_team_count,
        input_question_timer,
        input_team_colors
    )
    returning * into saved_set;

    for question_record in
        select value, ordinality
        from jsonb_array_elements(input_questions)
            with ordinality
    loop
        question_text_value := nullif(
            trim(question_record.value ->> 'question_text'),
            ''
        );
        question_item_value := nullif(
            question_record.value ->> 'question_item_id',
            ''
        )::bigint;

        if question_text_value is null
           and question_item_value is null then
            raise exception
                'Question % needs text or an image.',
                question_record.ordinality;
        end if;

        if char_length(question_text_value) > 300 then
            raise exception
                'Question % text is too long.',
                question_record.ordinality;
        end if;

        if question_item_value is not null
           and not exists (
                select 1
                from public.items
                where id = question_item_value
                  and active = true
                  and image_url is not null
           ) then
            raise exception
                'Question % uses an unavailable image.',
                question_record.ordinality;
        end if;

        if jsonb_typeof(
            question_record.value -> 'choices'
        ) <> 'array' then
            raise exception
                'Question % has an invalid answer list.',
                question_record.ordinality;
        end if;

        choice_count := jsonb_array_length(
            question_record.value -> 'choices'
        );

        if choice_count not between 2 and 4 then
            raise exception
                'Question % must contain between 2 and 4 answer choices.',
                question_record.ordinality;
        end if;

        select count(*)
        into correct_count
        from jsonb_array_elements(
            question_record.value -> 'choices'
        ) as choice(value)
        where coalesce(
            (choice.value ->> 'is_correct')::boolean,
            false
        );

        if correct_count <> 1 then
            raise exception
                'Question % must have exactly one correct answer.',
                question_record.ordinality;
        end if;

        insert into public.claim_grid_questions (
            set_id,
            position,
            question_text,
            question_item_id
        )
        values (
            saved_set.id,
            question_record.ordinality::smallint,
            question_text_value,
            question_item_value
        )
        returning * into saved_question;

        for choice_record in
            select value, ordinality
            from jsonb_array_elements(
                question_record.value -> 'choices'
            ) with ordinality
        loop
            answer_text_value := nullif(
                trim(choice_record.value ->> 'answer_text'),
                ''
            );
            answer_item_value := nullif(
                choice_record.value ->> 'answer_item_id',
                ''
            )::bigint;

            if answer_text_value is null
               and answer_item_value is null then
                raise exception
                    'Answer % in question % needs text or an image.',
                    choice_record.ordinality,
                    question_record.ordinality;
            end if;

            if char_length(answer_text_value) > 180 then
                raise exception
                    'Answer % in question % is too long.',
                    choice_record.ordinality,
                    question_record.ordinality;
            end if;

            if answer_item_value is not null
               and not exists (
                    select 1
                    from public.items
                    where id = answer_item_value
                      and active = true
                      and image_url is not null
               ) then
                raise exception
                    'Answer % in question % uses an unavailable image.',
                    choice_record.ordinality,
                    question_record.ordinality;
            end if;

            insert into public.claim_grid_choices (
                question_id,
                position,
                answer_text,
                answer_item_id,
                is_correct
            )
            values (
                saved_question.id,
                choice_record.ordinality::smallint,
                answer_text_value,
                answer_item_value,
                coalesce(
                    (choice_record.value ->> 'is_correct')::boolean,
                    false
                )
            );
        end loop;
    end loop;

    return saved_set;
end;
$function$;

revoke all on function public.save_claim_grid_set(
    text,
    smallint,
    smallint,
    text[],
    jsonb
) from public, anon;

grant execute on function public.save_claim_grid_set(
    text,
    smallint,
    smallint,
    text[],
    jsonb
) to authenticated;

commit;
