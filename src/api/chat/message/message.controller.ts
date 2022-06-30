import { NextFunction, Request, Response } from "express";
import { IAuthenticatedRequest } from "../../helper/authMiddleware";
import { RoomService } from "../room/room.service";
import { MessageService } from "./message.service";

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  sendMessage = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const body = req.body.body;
      const user_id = req?.user?.id as number;
      const room_id = +req.params.id;

      const isUserBelongToTheRoom = await RoomService.isUserBelongToTheRoom(room_id, user_id);

      if (!isUserBelongToTheRoom) {
        return res.status(403).json({
          message: "You are not belong to the room",
          code: 403
        });
      }

      const message = await this.messageService.sendMessage(body, user_id, room_id);
      return res.status(200).json({
        data: { message },
        message: "Message sent successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  getMessages = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const room_id = +req.params.id;
      const from = req.query.from as string;

      const messages = await this.messageService.getMessages(room_id, from);
      return res.status(200).json({
        data: { messages },
        message: "Messages fetched successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }
}