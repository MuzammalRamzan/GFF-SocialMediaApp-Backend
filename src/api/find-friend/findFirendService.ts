import { FindFriendModel } from "./findFirendModel";
import { FindFriend, IFindFriendService } from "./interface";

export class FindFriendService implements IFindFriendService {
  async add(sender_id: number, receiver_id: number): Promise<FindFriendModel> {
    const transactionCategory = await FindFriendModel.create({
      sender_id: sender_id,
      receiver_id: receiver_id,
      is_approved: false
    })

    return transactionCategory as FindFriendModel
  }
}
