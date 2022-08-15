import { NextFunction, Response } from "express";
import { IAuthenticatedRequest } from "../../helper/authMiddleware";
import { User } from "../../user/userModel";
import { UserService } from "../../user/userService";
import { RoomService } from "./room.service";

export class RoomController {
  private roomService: RoomService;
  constructor() {
    this.roomService = new RoomService();
  }

  getAllRooms = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const rooms = await this.roomService.getAllRooms(userId);

      for (const room of rooms) {
        const user_ids = room.get('user_ids') as number[]
        const users = await UserService.getUsersByIds(user_ids);

        console.log(users.map((user: any) => ({
          id: user.get('id'),
          full_name: user.get('full_name') || null,
          profile_url: user?.get('user_information')?.get('profile_url') || null
        })));
      }

      const data = await Promise.all(rooms.map(async (room: any) => {
        const user_ids = room.get('user_ids') as number[]
        const users = await UserService.getUsersByIds(user_ids);

        return {
          ...room.get(),
          user_ids: user_ids,
          users: users.map((user: any) => ({
            id: user.get('id'),
            full_name: user.get('full_name') || null,
            profile_url: user?.get('user_information')?.get('profile_url') || null
          }))
        }
      }));

      res.status(200).json({
        data: { rooms: data },
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