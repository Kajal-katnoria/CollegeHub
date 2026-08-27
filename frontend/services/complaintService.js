const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/complaints`;

export const getComplaints = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const text = await response.text();
    console.error("GET COMPLAINTS ERROR:", response.status, text);
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
};

export const createComplaint = async (data, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("CREATE COMPLAINT ERROR:", response.status, text);

    let error;
    try {
      error = JSON.parse(text);
    } catch {
      error = {};
    }

    throw new Error(error.message || "Failed to create complaint");
  }

  return response.json();
};