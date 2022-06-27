import { NextFunction, Response } from "express";
import { IAuthenticatedRequest } from "../../helper/authMiddleware";
import { RoomService } from "./room.service";

export class RoomController {
  private roomService: RoomService;
  constructor() {
    this.roomService = new RoomService();
  }

  getAllRooms = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const rooms = await this.roomService.getRooms();
      res.status(200).json({
        data: { rooms },
        message: "Successfully fetched all rooms",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  getRoomById = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const room = await this.roomService.getRoom(req.params.id);
      const code = room ? 200 : 404;
      res.status(code).json({
        data: { room },
        message: room ? "Successfully fetched room" : "Room not found",
        code: code
      });
    } catch (error) {
      throw error;
    }
  }

  createRoom = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const room = await this.roomService.createRoom(req.body);
      return res.status(200).json({
        data: { room },
        message: "Room created successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  joinRoom = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const room = await this.roomService.joinRoom(+req.params.id, req?.user?.id as number);
      return res.status(200).json({
        data: { room },
        message: "Room joined successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }
}