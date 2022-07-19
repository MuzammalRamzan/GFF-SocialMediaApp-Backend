import { IHashtagService, HashtagType } from "./interface";
import { Hashtag } from "./hashtagModel";
import { UserInformation } from "../user-information/userInformationModel";

export class HashtagService implements IHashtagService {
    async add(params: HashtagType, userId: number): Promise<Hashtag> {
        let hashtagText = params.hashtag_name
        hashtagText = hashtagText.replace(/\s/g, '')

        hashtagText = hashtagText.charAt(0) != '#' ? '#' + hashtagText : hashtagText

        const hashtag = await Hashtag.create({
            hashtag_name: hashtagText,
            user_information_id: userId
        })
        return hashtag
    }

    async list(): Promise<Hashtag[]> {
        const hashtags = await Hashtag.findAll()

        return hashtags
    }

    async fetchById(id: number): Promise<Hashtag[]> {
        const hashtags = await Hashtag.findAll({
            where: {
                user_information_id: id
            }
        })

        return hashtags as any
    }

    async update(id: number, params: HashtagType): Promise<Hashtag> {
        let hashtagText = params.hashtag_name
        hashtagText = hashtagText.replace(/\s/g, '')
        hashtagText = hashtagText.charAt(0) != '#' ? '#' + hashtagText : hashtagText

        const hashtag = await Hashtag.findOne({
            where: {
                id: id
            }
        });

        if (hashtag) {
            await hashtag.update({
                hashtag_name: hashtagText
            })
        }

        return hashtag as Hashtag;
    }

    async delete(id: number): Promise<number> {
        const deletedRow = await Hashtag.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}
