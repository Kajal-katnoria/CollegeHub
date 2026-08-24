const API_URL = "http://localhost:5000/api/chat";

// GET GROUP MESSAGES
export async function getGroupMessages(groupId, token) {
    const response = await fetch(
        `${API_URL}/${groupId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch messages");
    }

    return response.json();
}