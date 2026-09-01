begin;

create or replace function public.submit_claim_grid_answer(
    input_player_id uuid,
    input_choice_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_player public.claim_grid_players;
    target_session public.claim_grid_sessions;
    target_question public.claim_grid_session_questions;
    target_choice public.claim_grid_session_choices;
    saved_answer public.claim_grid_answers;
begin
    select * into target_player
    from public.claim_grid_players
    where id = input_player_id
      and user_id = auth.uid();

    if not found then
        raise exception 'This player session is unavailable.';
    end if;

    select * into target_session
    from public.claim_grid_sessions
    where id = target_player.session_id
      and status = 'active'
      and expires_at > now();

    if not found then
        raise exception 'This Claim the Grid game is not active.';
    end if;

    if target_session.question_started_at is null
       or now() >= target_session.question_started_at
            + make_interval(secs => target_session.question_timer) then
        raise exception 'Time is up for this question.';
    end if;

    select * into target_question
    from public.claim_grid_session_questions
    where session_id = target_session.id
      and position = target_session.current_question_position;

    select * into target_choice
    from public.claim_grid_session_choices
    where id = input_choice_id
      and question_id = target_question.id;

    if not found then
        raise exception 'That answer choice is unavailable.';
    end if;

    if exists (
        select 1
        from public.claim_grid_answers
        where question_id = target_question.id
          and player_id = target_player.id
    ) then
        raise exception 'You already answered this question.';
    end if;

    insert into public.claim_grid_answers (
        session_id,
        question_id,
        player_id,
        choice_id,
        is_correct
    ) values (
        target_session.id,
        target_question.id,
        target_player.id,
        target_choice.id,
        target_choice.is_correct
    )
    returning * into saved_answer;

    return jsonb_build_object(
        'answer_id', saved_answer.id,
        'choice_id', saved_answer.choice_id,
        'is_correct', saved_answer.is_correct,
        'answered_at', saved_answer.answered_at
    );
end;
$function$;

create or replace function public.get_claim_grid_player_answer_state(
    input_player_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_player public.claim_grid_players;
    target_session public.claim_grid_sessions;
    target_question_id bigint;
    target_answer public.claim_grid_answers;
begin
    select * into target_player
    from public.claim_grid_players
    where id = input_player_id
      and user_id = auth.uid();

    if not found then
        raise exception 'This player session is unavailable.';
    end if;

    select * into target_session
    from public.claim_grid_sessions
    where id = target_player.session_id;

    select id into target_question_id
    from public.claim_grid_session_questions
    where session_id = target_session.id
      and position = target_session.current_question_position;

    select * into target_answer
    from public.claim_grid_answers
    where question_id = target_question_id
      and player_id = target_player.id;

    if not found then
        return null;
    end if;

    return jsonb_build_object(
        'choice_id', target_answer.choice_id,
        'is_correct', target_answer.is_correct,
        'answered_at', target_answer.answered_at
    );
end;
$function$;

create or replace function public.get_claim_grid_answer_progress(
    input_session_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_session public.claim_grid_sessions;
    target_question_id bigint;
begin
    select * into target_session
    from public.claim_grid_sessions
    where id = input_session_id
      and host_id = auth.uid();

    if not found then
        raise exception 'This Claim the Grid room is unavailable.';
    end if;

    select id into target_question_id
    from public.claim_grid_session_questions
    where session_id = target_session.id
      and position = target_session.current_question_position;

    return jsonb_build_object(
        'answered_count', (
            select count(*)
            from public.claim_grid_answers
            where question_id = target_question_id
        ),
        'player_count', (
            select count(*)
            from public.claim_grid_players
            where session_id = target_session.id
        )
    );
end;
$function$;

revoke all on function public.submit_claim_grid_answer(uuid, bigint)
from public, anon;
revoke all on function public.get_claim_grid_player_answer_state(uuid)
from public, anon;
revoke all on function public.get_claim_grid_answer_progress(uuid)
from public, anon;

grant execute on function public.submit_claim_grid_answer(uuid, bigint)
to authenticated;
grant execute on function public.get_claim_grid_player_answer_state(uuid)
to authenticated;
grant execute on function public.get_claim_grid_answer_progress(uuid)
to authenticated;

commit;
