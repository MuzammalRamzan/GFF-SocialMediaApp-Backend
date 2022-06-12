import { FindFriendModel, IFriendRequest } from "./findFriendModel";
import { FindFriend, IFindFriendService, RequestStatus, RequestType, SearchFriend } from "./interface";
import { User } from "../user/userModel"
import { Op } from "sequelize";
import { UserInformation } from "../user-information/userInformationModel";

export class FindFriendService implements IFindFriendService {
  async getFriendRequestsBySenderId(sender_id: number): Promise<FindFriend[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: { sender_id: sender_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND },
        include: [
          {
            model: User,
            as: 'receiver',
            identifier: 'receiver_id',
            foreignKey: 'id',
            attributes: ['id', 'full_name'],
            include: [
              {
                model: UserInformation,
                as: 'user_information',
                attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
              }
            ]
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
        status: user.status
      };
    });
  }

  async getFriendRequestsByReceiverId(receiver_id: number): Promise<FindFriend[]> {
    const findFriends = await FindFriendModel.findAll(
      {
        where: { receiver_id: receiver_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND },
        include: [
          {
            model: User,
            as: 'sender',
            identifier: 'sender_id',
            foreignKey: 'id',
            attributes: ['id', 'full_name'],
            include: [
              {
                model: UserInformation,
                as: 'user_information',
                attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
              }
            ]
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
        status: user.status
      }
    });
  }

  async add(sender_id: number, receiver_id: number): Promise<FindFriendModel> {
    const SendRequest = await FindFriendModel.create({
      sender_id: sender_id,
      receiver_id: receiver_id,
      request_type: RequestType.FRIEND
    })

    return SendRequest as FindFriendModel
  }

  async approve(request_id: number, user_id: number): Promise<FindFriendModel> {
    const findFriend = await FindFriendModel.findOne({ where: { id: request_id, receiver_id: user_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND } })

    if (!findFriend) {
      throw new Error('Invalid friend request, you have already approved/reject this request!')
    }

    findFriend.set('status', RequestStatus.APPROVE)
    await findFriend.save()

    return findFriend as FindFriendModel;
  }

  async reject(request_id: number, user_id: number): Promise<FindFriendModel> {
    const findFriend = await FindFriendModel.findOne({ where: { id: request_id, receiver_id: user_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND } })

    if (!findFriend) {
      throw new Error(`Invalid friend request, you have already approved/reject this request!`);
    }

    findFriend.set('status', RequestStatus.REJECT)
    await findFriend.save()

    return findFriend as FindFriendModel;
  }

  async findBySenderIdAndReceiverId(sender_id: number, receiver_id: number): Promise<IFriendRequest> {
    const findFriend = await FindFriendModel.findOne({
      where: {
        sender_id: sender_id,
        receiver_id: receiver_id,
        request_type: RequestType.FRIEND
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
          status: RequestStatus.APPROVE,
          request_type: RequestType.FRIEND
        },
        include: [
          {
            model: User,
            as: 'receiver',
            identifier: 'receiver_id',
            foreignKey: 'id',
            attributes: ['id', 'full_name'],
            include: [
              {
                model: UserInformation,
                as: 'user_information',
                attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
              }
            ]
          },
          {
            model: User,
            as: 'sender',
            identifier: 'sender_id',
            foreignKey: 'id',
            attributes: ['id', 'full_name'],
            include: [
              {
                model: UserInformation,
                as: 'user_information',
                attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
              }
            ]
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
          status: user.status
        };
      } else {
        return {
          id: user.id,
          sender: user.sender.get(),
          sender_id: user.sender_id,
          receiver_id: user.receiver_id,
          status: user.status
        }
      }
    });
  }

  async findFriend(searchTerm: string, userId: number): Promise<SearchFriend[]> {
    const findFriends = await User.findAll({
      where: {
        full_name: {
          [Op.like]: `%${searchTerm}%`
        },
        id: {
          [Op.ne]: userId
        }
      },
      attributes: ['id', 'full_name'],
      include: [
        {
          model: UserInformation,
          as: 'user_information',
          attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
          where: {
            profile_url: {
              [Op.ne]: null,
            },
            job_role: {
              [Op.ne]: null,
            }
          }
        }
      ]
    });

    return findFriends.map(friend => {
      const data = friend.get();

      return {
        full_name: data.full_name,
        id: data.id,
        user_information: data?.user_information?.get()
      }
    });
  }
}
