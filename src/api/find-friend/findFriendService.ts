import { FindFriendModel, IFriendRequest } from "./findFriendModel";
import { FindFriend, IFindFriendService, RequestType } from "./interface";
import { User } from "../user/userModel"
import { Op } from "sequelize";

export class FindFriendService implements IFindFriendService {
  async getFriendRequestsBySenderId(sender_id: number): Promise<any[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: { sender_id: sender_id, request_type: RequestType.SEND },
        raw: true,
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

    return findFriends.map((friend: any) => {
      let user: any = {
        id: friend.id,
        userId: friend.receiver_id,
        firstname: friend['receiver.firstname'],
        lastname: friend['receiver.lastname'],
      };

      return user
    });
  }

  async getFriendRequestsByReceiverId(receiver_id: number): Promise<any[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: { receiver_id: receiver_id, request_type: RequestType.SEND },
        raw: true,
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

    return findFriends.map((friend: any) => {
      let user: any = {
        id: friend.id,
        userId: friend.sender_id,
        firstname: friend['sender.firstname'],
        lastname: friend['sender.lastname'],
      };

      return user
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

  async friends(userId: number): Promise<any[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: {
          [Op.or]: [
            { sender_id: userId },
            { receiver_id: userId }
          ],
          request_type: RequestType.APPROVE
        },
        raw: true,
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

    return findFriends.map((friend: any) => {
      let user: any = {};
      if (friend.sender_id === userId) {
        user = {
          userId: friend.receiver_id,
          firstname: friend['receiver.firstname'],
          lastname: friend['receiver.lastname'],
        };
      } else {
        user = {
          userId: friend.sender_id,
          firstname: friend['sender.firstname'],
          lastname: friend['sender.lastname'],
        }
      }

      user.id = friend.id;

      return user
    });
  }
}
