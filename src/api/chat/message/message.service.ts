import { Op } from "sequelize";
import { UserInformation } from "../../user-information/userInformationModel";
import { User } from "../../user/userModel";
import { Message } from "./message.model";

export class MessageService {
  public async sendMessage(body: string, user_id: number, room_id: number): Promise<Message> {
    return await Message.create({
      body,
      user_id,
      room_id
    });
  }

  public async getMessages(room_id: number, from: string): Promise<Message[]> {
    const from_date = new Date(from);

    return await Message.findAll({
      where: {
        room_id,
        created_at: {
          [Op.gte]: from_date
        }
      },
      order: [["created_at", "ASC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name"],
          include: [
            {
              model: UserInformation,
              as: "user_information",
              attributes: ["profile_url"]
            }
          ]
        }
      ]
    });
  }
}