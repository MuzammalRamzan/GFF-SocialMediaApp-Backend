import { Room } from "./room.model";

export type RoomParams = {
  name: string;
  user_ids?: string[];
}

export interface IRoomService {
  getRoom(id: string): Promise<Room>;
  getRooms(): Promise<Room[]>;
  createRoom(params: RoomParams): Promise<Room>;
  joinRoom(room_id: number, user_id: number): Promise<Room>;
  getAllRooms(user_id: number): Promise<Room[]>;
  getAllUsersByRoomId(room_id:number): Promise<string[]>
}