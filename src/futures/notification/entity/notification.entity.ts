import { Schema, model, Types } from 'mongoose';

interface INotification {
    userId: Types.ObjectId;           // The user who receives the notification
    initiator: Types.ObjectId;       // The user who triggered the notification
    type: 'follow' | 'like' | 'comment' | 'reply';
    entityId: Types.ObjectId;        // ID of the post or comment related to the notification
    message: string;                 // Notification message
    isRead: boolean;                 // Whether the user has seen the notification
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    initiator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Notification = model<INotification>('Notification', NotificationSchema);
