const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/item`;

export async function getItems() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch marketplace items");
  }

  return res.json();
}

export async function getItem(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch marketplace item");
  }

  return res.json();
}

export async function createItem(formData, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to create marketplace item"
    );
  }

  return data;
}

export async function updateItem(id, data, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(
      responseData.message || "Failed to update item"
    );
  }

  return responseData;
}

export async function deleteItem(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to delete item"
    );
  }

  return data;
}