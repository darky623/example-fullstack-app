const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TASKS_ENDPOINT = `${API_BASE_URL}/tasks`;

async function handleResponse(response) {
  if (response.ok) {
    if (response.status === 204) {
      return null;
    }
    return response.json();
  }

  let detail = 'Request failed';
  try {
    const data = await response.json();
    if (data && data.detail) {
      detail = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg || d).join(', ')
        : data.detail;
    }
  } catch {
    // ignore parse errors
  }

  throw new Error(`${response.status} ${response.statusText}: ${detail}`);
}

export async function getTasks() {
  const res = await fetch(TASKS_ENDPOINT);
  return handleResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(TASKS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${TASKS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${TASKS_ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

