import { IUser } from "../../auth/entities/auth.entity";
import { Server } from "socket.io";
import { Notification } from "../entity/notification.entity";
import { Types } from "mongoose";
interface NotificationPayload {
  userId: string;
  type: "follow" | "postLike" | "commentLike" | "commentReply";
  message: string;
  initiator: Types.ObjectId;
  entityId: string;
}

export class NotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * @description Send a notification to a user
   * @param payload - The notification data to be sent
   */
  async sendNotification(payload: NotificationPayload) {
    const { userId, type, message, entityId ,initiator} = payload;

    // Save notification to DB
    await Notification.create({
      userId,
      type,
      initiator,
      message,
      entityId,
      read: false,
    });

    // Emit real-time notification
    this.io.to(userId).emit("notification", { type, message, entityId });
  }

  async notifyPostLiked(postId: string, likedByUser: IUser, initiator: Types.ObjectId) {
    const message = `${likedByUser.username} liked your post`;
    await this.sendNotification({
      userId: postId, // assuming the post entity has a userId associated
      type: "postLike",
      initiator,
      message,
      entityId: postId,
    });
  }

  async notifyCommentLiked(commentId: string,initiator: Types.ObjectId, likedByUser: IUser) {
    const message = `${likedByUser.username} liked your comment`;
    await this.sendNotification({
      userId: commentId, // assuming the comment entity has a userId associated
      type: "commentLike",
      initiator,
      message,
      entityId: commentId,
    });
  }

  async notifyNewFollower(followedUserId: string, initiator: Types.ObjectId,follower: IUser) {
    const message = `${follower.username} started following you`;
    await this.sendNotification({
      userId: followedUserId,
      type: "follow",
      initiator,
      message,
      entityId: follower.id,
    });
  }

}
