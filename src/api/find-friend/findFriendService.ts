import { FindFriendModel, IFriendRequest } from "./findFriendModel";
import { FindFriend, IFindFriendService, RequestType } from "./interface";
import { User } from "../user/userModel"
import { Op } from "sequelize";

export class FindFriendService implements IFindFriendService {
  async getFriendRequestsBySenderId(sender_id: number): Promise<FindFriend[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: { sender_id: sender_id, request_type: RequestType.SEND },
        include: [
          {
            model: User,
            as: 'receiver',
            identifier: 'receiver_id',
            foreignKey: 'id',
            attributes: ['id', 'firstname', 'lastname'],
          }
        ]
      },
    );

    return findFriends.map((friend) => {
      const user = friend.get();

      return {
        id: user.id,
        receiver: user.receiver.get(),
        sender_id: user.sender_id,
        receiver_id: user.receiver_id,
        request_type: user.request_type
      };
    });
  }

  async getFriendRequestsByReceiverId(receiver_id: number): Promise<FindFriend[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: { receiver_id: receiver_id, request_type: RequestType.SEND },
        include: [
          {
            model: User,
            as: 'sender',
            identifier: 'sender_id',
            foreignKey: 'id',
            attributes: ['id', 'firstname', 'lastname'],
          }
        ]
      },
    );

    return findFriends.map((friend) => {
      const user = friend.get();
      return {
        id: user.id,
        sender: user.sender.get(),
        sender_id: user.sender_id,
        receiver_id: user.receiver_id,
        request_type: user.request_type
      }
    });
  }

  async add(sender_id: number, receiver_id: number): Promise<FindFriendModel> {
    const SendRequest = await FindFriendModel.create({
      sender_id: sender_id,
      receiver_id: receiver_id,
    })

    return SendRequest as FindFriendModel
  }

  async approve(request_id: number, user_id: number): Promise<FindFriendModel> {
    const findFriend = await FindFriendModel.findOne({ where: { id: request_id, receiver_id: user_id, request_type: RequestType.SEND } })

    if (!findFriend) {
      throw new Error('Invalid friend request, you have already approved/reject this request!')
    }

    findFriend.set('request_type', RequestType.APPROVE)
    await findFriend.save()

    return findFriend as FindFriendModel;
  }

  async reject(request_id: number, user_id: number): Promise<FindFriendModel> {
    const findFriend = await FindFriendModel.findOne({ where: { id: request_id, receiver_id: user_id, request_type: RequestType.SEND } })

    if (!findFriend) {
      throw new Error(`Invalid friend request, you have already approved/reject this request!`);
    }

    findFriend.set('request_type', RequestType.REJECT)
    await findFriend.save()

    return findFriend as FindFriendModel;
  }

  async findBySenderIdAndReceiverId(sender_id: number, receiver_id: number): Promise<IFriendRequest> {
    const findFriend = await FindFriendModel.findOne({
      where: {
        sender_id: sender_id,
        receiver_id: receiver_id,
      }
    });

    return findFriend?.get();
  }

  async friends(userId: number): Promise<FindFriend[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: {
          [Op.or]: [
            { sender_id: userId },
            { receiver_id: userId }
          ],
          request_type: RequestType.APPROVE
        },
        include: [
          {
            model: User,
            as: 'receiver',
            identifier: 'receiver_id',
            foreignKey: 'id',
            attributes: ['id', 'firstname', 'lastname'],
          },
          {
            model: User,
            as: 'sender',
            identifier: 'sender_id',
            foreignKey: 'id',
            attributes: ['id', 'firstname', 'lastname'],
          }
        ]
      },
    );

    return findFriends.map((friend) => {
      const user = friend.get();
      if (user.sender_id === userId) {
        return {
          id: user.id,
          receiver: user.receiver.get(),
          sender_id: user.sender_id,
          receiver_id: user.receiver_id,
          request_type: user.request_type
        };
      } else {
        return {
          id: user.id,
          sender: user.sender.get(),
          sender_id: user.sender_id,
          receiver_id: user.receiver_id,
          request_type: user.request_type
        }
      }
    });
  }
}
