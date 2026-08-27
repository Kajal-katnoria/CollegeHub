const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/event`;

export async function getEvents() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const text = await res.text();
    console.error("GET EVENTS ERROR:", res.status, text);
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export async function createEvent(eventData, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("CREATE EVENT ERROR:", res.status, text);
    throw new Error("Failed to create event");
  }

  return res.json();
}

export async function registerEvent(id, token) {
  const res = await fetch(`${API_URL}/register/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("REGISTER EVENT ERROR:", res.status, text);
    throw new Error("Failed to register for event");
  }

  return res.json();
}