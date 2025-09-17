import supabaseClient from "../utils/supabase";

// Get notifications for current user
export async function getNotifications(token) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error);
        return null;
    }

    return data;
}

// Get unread notification count
export async function getUnreadCount(token) {
    const supabase = await supabaseClient(token);

    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);

    if (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }

    return count || 0;
}

// Mark notification as read
export async function markNotificationRead(token, { notification_id }) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .rpc("mark_notification_read", { notification_id });

    if (error) {
        console.error("Error marking notification as read:", error);
        return null;
    }

    return data;
}

// Mark all notifications as read
export async function markAllNotificationsRead(token) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .rpc("mark_all_notifications_read");

    if (error) {
        console.error("Error marking all notifications as read:", error);
        return null;
    }

    return data;
}

// Create notification (used internally by the system)
export async function createNotification(token, notificationData) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .rpc("create_notification", {
            p_user_id: notificationData.user_id,
            p_type: notificationData.type,
            p_title: notificationData.title,
            p_message: notificationData.message,
            p_data: notificationData.data || {}
        });

    if (error) {
        console.error("Error creating notification:", error);
        return null;
    }

    return data;
}

// Subscribe to real-time notifications
export function subscribeToNotifications(token, userId, callback) {
    return supabaseClient(token).then(supabase => {
        return supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                callback
            )
            .subscribe();
    });
}