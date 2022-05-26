import { FindFriendModel } from "./findFriendModel";
import { FindFriend, IFindFriendService, RequestType } from "./interface";

export class FindFriendService implements IFindFriendService {
  async add(sender_id: number, receiver_id: number): Promise<FindFriendModel> {
    const SendRequest = await FindFriendModel.create({
      sender_id: sender_id,
      receiver_id: receiver_id,
    })

    return SendRequest as FindFriendModel
  }

  async approve(request_id: number): Promise<FindFriendModel> {
    await FindFriendModel.update({
      request_type: RequestType.APPROVE
    }, {
      where: { id: request_id },
    });

    const findFriend = await FindFriendModel.findOne({ where: { id: request_id } })
    if (!findFriend) {
      return `Friend request not found!` as any;
    }
    return findFriend as FindFriendModel;
  }
  async reject(request_id: number): Promise<FindFriendModel> {
    await FindFriendModel.update({
      request_type: RequestType.REJECT
    }, {
      where: { id: request_id },
    });

    const findFriend = await FindFriendModel.findOne({ where: { id: request_id } })
    if (!findFriend) {
      return `Friend request not found!` as any;
    }
    return findFriend as FindFriendModel;
  }
}
