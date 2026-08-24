const API_URL = "http://localhost:5000/api/notifications";

export async function getNotifications(token) {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch notifications");
    }

    return response.json();
}

export async function markNotificationAsRead(
    notificationId,
    token
) {
    const response = await fetch(
        `${API_URL}/${notificationId}/read`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(
            text || "Failed to mark notification as read"
        );
    }

    return response.json();
}