begin;

create or replace function public.end_claim_grid_question_early(
    input_session_id uuid
)
returns public.claim_grid_sessions
language plpgsql
security definer
set search_path = ''
as $function$
declare
    target_session public.claim_grid_sessions;
    target_question_id bigint;
    player_count integer;
    answer_count integer;
begin
    select * into target_session
    from public.claim_grid_sessions
    where id = input_session_id
      and host_id = auth.uid()
      and status = 'active';

    if not found then
        raise exception 'This Claim the Grid room is unavailable.';
    end if;

    select id into target_question_id
    from public.claim_grid_session_questions
    where session_id = target_session.id
      and position = target_session.current_question_position;

    select count(*) into player_count
    from public.claim_grid_players
    where session_id = target_session.id;

    select count(*) into answer_count
    from public.claim_grid_answers
    where question_id = target_question_id;

    if player_count > 0
       and answer_count >= player_count
       and target_session.round_phase = 'question'
       and now() < target_session.question_started_at
            + make_interval(secs => target_session.question_timer) then
        update public.claim_grid_sessions
        set question_started_at = now()
                - make_interval(secs => question_timer),
            updated_at = now()
        where id = target_session.id
        returning * into target_session;
    end if;

    return target_session;
end;
$function$;

create or replace function public.get_claim_grid_question_result(
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
    correct_choice_id bigint;
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

    if target_session.round_phase = 'question'
       and now() < target_session.question_started_at
            + make_interval(secs => target_session.question_timer) then
        return null;
    end if;

    select id into target_question_id
    from public.claim_grid_session_questions
    where session_id = target_session.id
      and position = target_session.current_question_position;

    select id into correct_choice_id
    from public.claim_grid_session_choices
    where question_id = target_question_id
      and is_correct = true;

    select * into target_answer
    from public.claim_grid_answers
    where question_id = target_question_id
      and player_id = target_player.id;

    return jsonb_build_object(
        'correct_choice_id', correct_choice_id,
        'choice_id', target_answer.choice_id,
        'is_correct', target_answer.is_correct
    );
end;
$function$;

revoke all on function public.end_claim_grid_question_early(uuid)
from public, anon;
revoke all on function public.get_claim_grid_question_result(uuid)
from public, anon;

grant execute on function public.end_claim_grid_question_early(uuid)
to authenticated;
grant execute on function public.get_claim_grid_question_result(uuid)
to authenticated;

commit;
