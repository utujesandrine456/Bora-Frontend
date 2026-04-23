'use client';

import React, { useState, useEffect } from 'react';
import {
    Bell,
    Check,
    Briefcase,
    MessageSquare,
    UserPlus,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { notificationsApi } from '@/lib/api/notifications';
import { Notification } from '@/lib/api/types';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsApi.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read);
            if (unread.length === 0) return;
            
            toast.loading('Marking all as read...', { id: 'mark-all' });
            await Promise.all(unread.map(n => notificationsApi.markAsRead(n._id)));
            
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success('All marked as read', { id: 'mark-all' });
        } catch (error) {
            toast.error('Failed to mark all as read', { id: 'mark-all' });
        }
    };

    const toggleReadStatus = async (id: string, currentStatus: boolean) => {
        if (currentStatus) return; // Backend may not support marking as unread, sticking to read
        try {
            await notificationsApi.markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            toast.error('Failed to update notification');
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'application': return UserPlus;
            case 'message': return MessageSquare;
            case 'system': return AlertCircle;
            case 'job': return Briefcase;
            case 'screening': return CheckCircle2;
            default: return Bell;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'application': return { color: 'text-blue-400', bg: 'bg-blue-400/10' };
            case 'message': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
            case 'system': return { color: 'text-amber-400', bg: 'bg-amber-400/10' };
            case 'job': return { color: 'text-purple-400', bg: 'bg-purple-400/10' };
            case 'screening': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
            default: return { color: 'text-cream/40', bg: 'bg-cream/10' };
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream/10 pb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-5xl font-black text-cream ">Notifications</h1>
                            {unreadCount > 0 && (
                                <div className="bg-cream text-dark px-3 mt-2 py-0.5 rounded-full text-sm font-bold">
                                    {unreadCount} New
                                </div>
                            )}
                        </div>
                        <p className="text-cream/60 font-medium text-md italic serif">Stay updated on your platform activities and candidate pipelines.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" className="gap-2" onClick={markAllAsRead}>
                            <Check className="w-4 h-4" /> Mark all as read
                        </Button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-24 w-full bg-cream/5 animate-pulse rounded-md border border-cream/10" />
                        ))
                    ) : notifications.map((notification) => {
                        const Icon = getIconForType(notification.type);
                        const styles = getColorForType(notification.type);
                        const timeStr = new Date(notification.createdAt).toLocaleDateString();

                        return (
                            <Card
                                key={notification._id}
                                className={`p-5 transition-all duration-300 relative group overflow-hidden ${notification.read ? 'border-cream/5 bg-transparent' : 'border-cream/20 bg-cream/5'
                                    }`}
                            >
                                {!notification.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cream rounded-l-md" />
                                )}

                                <div className="flex items-start gap-5">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${styles.bg}`}>
                                        <Icon className={`w-6 h-6 ${styles.color}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                            <h3 className={`text-lg font-bold truncate ${notification.read ? 'text-cream/80' : 'text-cream'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs font-bold text-cream/40 whitespace-nowrap hidden sm:block">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${notification.read ? 'text-cream/50' : 'text-cream/70 font-medium'} max-w-2xl`}>
                                            {notification.message}
                                        </p>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2 opactiy-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleReadStatus(notification._id, notification.read)}
                                            className="p-2 hover:bg-cream/10 rounded-md text-cream/50 hover:text-cream transition-colors"
                                            title={notification.read ? "Read" : "Mark as read"}
                                        >
                                            {notification.read ? <Check className="w-4 h-4 text-emerald-500" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    {notifications.length === 0 && (
                        <div className="py-20 text-center space-y-4 border border-dashed border-cream/10 rounded-md">
                            <Bell className="w-12 h-12 text-cream/10 mx-auto" />
                            <p className="text-cream/40 font-bold ">You&apos;re all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
