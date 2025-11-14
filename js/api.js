const API_HOST = "http://10.0.0.238:8083";
const API_TOKEN =
  "8bda83f76964192c7f1e435b887c1b74359af0347721458610cdae3654a433b6";

async function createTrainingTask(config) {
  const res = await fetch(`${API_HOST}/training/task/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "api-token": API_TOKEN,
    },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

async function getTrainingTaskLogs(taskId, offset = 0, limit = 2) {
  const res = await fetch(
    `${API_HOST}/training/task/${taskId}/logs?offset=${offset}&limit=${limit}`,
    {
      method: "GET",
      headers: { accept: "application/json", "api-token": API_TOKEN },
    }
  );
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

async function getTrainingTaskResult(taskId) {
  const res = await fetch(`${API_HOST}/training/task/info/${taskId}`, {
    method: "GET",
    headers: { accept: "application/json", "api-token": API_TOKEN },
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

async function getNodeTrainingAvailable() {
  const res = await fetch(`${API_HOST}/training/nodes/available`, {
    method: "GET",
    headers: { accept: "application/json", "api-token": API_TOKEN },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export {
  createTrainingTask,
  getTrainingTaskLogs,
  getTrainingTaskResult,
  getNodeTrainingAvailable,
};
