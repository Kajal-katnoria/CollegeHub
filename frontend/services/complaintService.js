const API_URL = "http://localhost:5000/api/complaints";

export const getComplaints = async () => {
  const response = await fetch(API_URL);

  return response.json();
};

export const createComplaint = async (data, token) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },

    body: JSON.stringify(data)
  });

  return response.json();
};