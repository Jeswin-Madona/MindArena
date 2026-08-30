const BASE_URL = '/n8n'

class ApiError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

async function post(path, body = {}) {
  let res

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    throw new ApiError(
      'Could not reach the server. Check your connection and try again.',
      'NETWORK_ERROR'
    )
  }

  let data

  try {
    data = await res.json()
  } catch (err) {
    throw new ApiError(
      'The server sent back an unexpected response.',
      'BAD_RESPONSE'
    )
  }

  if (!res.ok) {
    throw new ApiError(
      data?.message || data?.error || 'Something went wrong.',
      data?.error_code || 'HTTP_ERROR'
    )
  }

  if (data?.success === false || data?.status === 'error') {
    throw new ApiError(
      data?.message || data?.error || 'Something went wrong.',
      data?.error_code || 'API_ERROR'
    )
  }

  return data
}

async function get(path, params = {}) {
  const query = new URLSearchParams(params).toString()

  let res

  try {
    res = await fetch(
      `${BASE_URL}${path}${query ? `?${query}` : ''}`,
      {
        method: 'GET',
      }
    )
  } catch (err) {
    throw new ApiError(
      'Could not reach the server. Check your connection and try again.',
      'NETWORK_ERROR'
    )
  }

  let data

  try {
    data = await res.json()
  } catch (err) {
    throw new ApiError(
      'The server sent back an unexpected response.',
      'BAD_RESPONSE'
    )
  }

  if (!res.ok) {
    throw new ApiError(
      data?.message || data?.error || 'Something went wrong.',
      data?.error_code || 'HTTP_ERROR'
    )
  }

  if (data?.success === false || data?.status === 'error') {
    throw new ApiError(
      data?.message || data?.error || 'Something went wrong.',
      data?.error_code || 'API_ERROR'
    )
  }

  return data
}

/*
 * n8n webhook paths
 *
 * Vite dev proxy proxies /n8n/* to http://localhost:5678/webhook-test/*
 *
 * Therefore:
 * /n8n/generate-quiz -> http://localhost:5678/webhook-test/generate-quiz
 * /n8n/get-quiz -> http://localhost:5678/webhook-test/get-quiz
 * /n8n/ai-feedback -> http://localhost:5678/webhook-test/ai-feedback
 * /n8n/arena-management-test -> http://localhost:5678/webhook-test/arena-management-test
 */

const WEBHOOKS = {
  generateQuiz: '/generate-quiz',
  getQuiz: '/get-quiz',
  aiFeedback: '/ai-feedback',
  arenaManagement: '/arena-management-test',
}

export const api = {
  /*
   * ============================================================
   * QUIZ GENERATOR
   * ============================================================
   */

  generateQuiz: ({
    topic,
    difficulty,
    number_of_questions,
  }) =>
    post(WEBHOOKS.generateQuiz, {
      topic,
      difficulty,
      number_of_questions,
    }),

  /*
   * ============================================================
   * GET QUIZ
   * ============================================================
   */

  getQuiz: (id) =>
    get(WEBHOOKS.getQuiz, {
      id,
    }),

  /*
   * ============================================================
   * AI FEEDBACK
   * ============================================================
   */

  getAiFeedback: ({
    topic,
    difficulty,
    score,
    total_questions,
    percentage,
  }) =>
    post(WEBHOOKS.aiFeedback, {
      topic,
      difficulty,
      score,
      total_questions,
      percentage,
    }),

  /*
   * ============================================================
   * ARENA — CREATE ROOM
   * ============================================================
   *
   * Calls:
   * POST /arena-management
   *
   * action: createRoom
   */

  createRoom: ({
    topic,
    difficulty,
    number_of_questions,
    max_players,
    host_id,
    player_name,
  }) =>
    post(WEBHOOKS.arenaManagement, {
      action: 'createRoom',
      topic,
      difficulty,
      number_of_questions,
      max_players,
      host_id,
      player_name,
    }),

  /*
   * ============================================================
   * ARENA — JOIN ROOM
   * ============================================================
   *
   * action: joinRoom
   */

  joinRoom: ({
    room_code,
    user_id,
    player_name,
  }) =>
    post(WEBHOOKS.arenaManagement, {
      action: 'joinRoom',
      room_code,
      user_id,
      player_name,
    }),

  /*
   * ============================================================
   * ARENA — GET ROOM
   * ============================================================
   *
   * The workflow accepts either room_code or room_id.
   */

  getRoom: ({
    room_code,
    room_id,
  }) =>
    post(WEBHOOKS.arenaManagement, {
      action: 'getRoom',
      ...(room_code ? { room_code } : {}),
      ...(room_id ? { room_id } : {}),
    }),

  /*
   * ============================================================
   * ARENA — START CONTEST
   * ============================================================
   *
   * Only the host is allowed to start the contest.
   */

  startContest: ({
    room_id,
    host_id,
    quiz_id,
  }) =>
    post(WEBHOOKS.arenaManagement, {
      action: 'startContest',
      room_id,
      host_id,
      ...(quiz_id ? { quiz_id } : {}),
    }),

  /*
   * ============================================================
   * ARENA — GET CONTEST
   * ============================================================
   *
   * Returns the contest questions after the room has started.
   */

  getContest: ({
    room_id,
  }) =>
    post(WEBHOOKS.arenaManagement, {
      action: 'getContest',
      room_id,
    }),

  /*
   * ============================================================
   * ARENA — SUBMIT RESULT
   * ============================================================
   *
   * Answers are sent to n8n.
   * The workflow calculates the score server-side.
   */

  submitResult: ({
    room_id,
    user_id,
    player_name,
    completion_time_seconds,
    answers,
  }) =>
    post(WEBHOOKS.arenaManagement, {
      action: 'submitResult',
      room_id,
      user_id,
      player_name,
      completion_time_seconds,
      answers,
    }),

  /*
   * ============================================================
   * ARENA — LEADERBOARD
   * ============================================================
   *
   * Returns all submitted results for the room,
   * ranked by score and completion time.
   */

  getLeaderboard: ({
    room_id,
  }) =>
    post(WEBHOOKS.arenaManagement, {
      action: 'getLeaderboard',
      room_id,
    }),
}

export { ApiError }