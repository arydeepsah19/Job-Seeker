import { useState, useEffect } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";
import useFetch from "../hooks/use-fetch";
import { 
    getNotifications, 
    getUnreadCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    subscribeToNotifications 
} from "../api/apiNotifications";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const { 
        fn: fnGetNotifications, 
        loading: loadingNotifications 
    } = useFetch(getNotifications);

    const { 
        fn: fnGetUnreadCount 
    } = useFetch(getUnreadCount);

    const { 
        fn: fnMarkRead 
    } = useFetch(markNotificationRead);

    const { 
        fn: fnMarkAllRead 
    } = useFetch(markAllNotificationsRead);

    // Load notifications and unread count
    const loadNotifications = async () => {
        if (!isLoaded || !user) return;
        
        const [notificationsData, unreadCountData] = await Promise.all([
            fnGetNotifications(),
            fnGetUnreadCount()
        ]);

        if (notificationsData) {
            setNotifications(notificationsData);
        }
        if (typeof unreadCountData === 'number') {
            setUnreadCount(unreadCountData);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [isLoaded, user]);

    // Subscribe to real-time notifications
    useEffect(() => {
        if (!isLoaded || !user) return;

        let subscription;

        const setupSubscription = async () => {
            subscription = await subscribeToNotifications(
                await user.getToken({ template: "supabase" }),
                user.id,
                (payload) => {
                    const newNotification = payload.new;
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    
                    // Show browser notification if permission granted
                    if (Notification.permission === "granted") {
                        new Notification(newNotification.title, {
                            body: newNotification.message,
                            icon: "/log1.png"
                        });
                    }
                }
            );
        };

        setupSubscription();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [isLoaded, user]);

    // Request notification permission
    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await fnMarkRead({ notification_id: notification.id });
            setNotifications(prev => 
                prev.map(n => 
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        // Navigate based on notification type
        if (notification.data?.job_id) {
            navigate(`/job/${notification.data.job_id}`);
        } else if (notification.type === 'application_status') {
            navigate('/my-job');
        }

        setIsOpen(false);
    };

    const handleMarkAllRead = async () => {
        await fnMarkAllRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'application_received':
                return '📝';
            case 'application_withdrawn':
                return '🗑️';
            case 'application_status':
                return '📊';
            case 'application_success':
                return '🎉';
            default:
                return '🔔';
        }
    };

    if (!isLoaded || !user) return null;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Notification Panel */}
                    <div className="absolute right-0 top-full mt-2 w-80 bg-card border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMarkAllRead}
                                        className="text-xs"
                                    >
                                        <CheckCheck size={14} className="mr-1" />
                                        Mark all read
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-6 w-6"
                                >
                                    <X size={14} />
                                </Button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {loadingNotifications ? (
                                <div className="p-4">
                                    <BarLoader width="100%" color="#36d7b7" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                                            !notification.read ? 'bg-blue-50/10' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-sm truncate">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {formatTimeAgo(notification.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;