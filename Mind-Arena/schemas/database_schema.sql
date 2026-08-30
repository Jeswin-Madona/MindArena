create table public.contest_results (
  id uuid not null default gen_random_uuid (),
  room_id uuid not null,
  user_id uuid not null,
  player_name text not null,
  score integer not null,
  total_questions integer not null,
  percentage numeric(5, 2) not null,
  completion_time_seconds integer not null,
  submitted_at timestamp with time zone null default now(),
  constraint contest_results_pkey primary key (id),
  constraint contest_results_room_id_user_id_key unique (room_id, user_id),
  constraint contest_results_room_id_fkey foreign KEY (room_id) references rooms (id) on delete CASCADE,
  constraint contest_results_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.profiles (
  id uuid not null default auth.uid (),
  created_at timestamp with time zone not null default now(),
  full_name text null,
  email text null,
  constraint profiles_pkey primary key (id)
) TABLESPACE pg_default;


create table public.profiles (
  id uuid not null default auth.uid (),
  created_at timestamp with time zone not null default now(),
  full_name text null,
  email text null,
  constraint profiles_pkey primary key (id)
) TABLESPACE pg_default;

create table public.quiz_attempts (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamp with time zone null default now(),
  topic text null,
  difficulty text null,
  constraint quiz_attempts_pkey primary key (id),
  constraint quiz_attempts_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.quizzes (
  id bigint generated always as identity not null,
  topic text not null,
  difficulty text not null,
  number_of_questions integer not null,
  created_at timestamp without time zone null default now(),
  constraint quizzes_pkey primary key (id)
) TABLESPACE pg_default;

create table public.room_players (
  id uuid not null default gen_random_uuid (),
  room_id uuid not null,
  user_id uuid not null,
  player_name text not null,
  is_host boolean not null default false,
  joined_at timestamp with time zone null default now(),
  constraint room_players_pkey primary key (id),
  constraint room_players_room_id_user_id_key unique (room_id, user_id),
  constraint room_players_room_id_fkey foreign KEY (room_id) references rooms (id) on delete CASCADE,
  constraint room_players_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.rooms (
  id uuid not null default gen_random_uuid (),
  room_code text not null,
  host_id uuid not null,
  quiz_id bigint null,
  topic text not null,
  difficulty text not null,
  number_of_questions integer not null default 5,
  max_players integer not null default 10,
  status text not null default 'waiting'::text,
  created_at timestamp with time zone null default now(),
  num_questions integer not null default 5,
  constraint rooms_pkey primary key (id),
  constraint rooms_room_code_key unique (room_code),
  constraint rooms_host_id_fkey foreign KEY (host_id) references profiles (id) on delete CASCADE,
  constraint rooms_quiz_id_fkey foreign KEY (quiz_id) references quizzes (id) on delete set null,
  constraint rooms_max_players_check check (
    (
      (max_players >= 2)
      and (max_players <= 10)
    )
  ),
  constraint rooms_status_check check (
    (
      status = any (
        array[
          'waiting'::text,
          'started'::text,
          'completed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;