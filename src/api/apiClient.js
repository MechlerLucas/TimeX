const API_BASE = "http://localhost:3001";

function queryParams(obj) {
  const query = Object.entries(obj)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");
  return query ? `?${query}` : "";
}

async function list(resource) {
  const res = await fetch(`${API_BASE}/${resource}`);
  return res.json();
}

async function create(resource, data) {
  const res = await fetch(`${API_BASE}/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}


async function update(resource, id, data) {
  const res = await fetch(`${API_BASE}/${resource}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar recurso");
  }
  return res.json();
}


async function remove(resource, id) {
  const res = await fetch(`${API_BASE}/${resource}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

async function filter(resource, params) {
  const res = await fetch(`${API_BASE}/${resource}${queryParams(params)}`);
  return res.json();
}

const api = {
  Task: {
    list: () => list("tasks"),
    create: (data) => create("tasks", data),
    update: (id, data) => update("tasks", id, data),
    delete: (id) => remove("tasks", id)
  },

  TaskCompletion: {
    list: () => list("taskCompletions"),
    create: (data) => create("taskCompletions", data),
    update: (id, data) => update("taskCompletions", id, data),
    filter: (params) => filter("taskCompletions", params),
    delete: (id) => remove("taskCompletions", id)
  },

  Category: {
    list: () => list("categories"),
    create: (data) => create("categories", data),
    update: (id, data) => update("categories", id, data)
  }
};

export default api;
