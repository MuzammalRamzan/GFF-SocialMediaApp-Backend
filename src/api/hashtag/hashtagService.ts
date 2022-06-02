import { IHashtagService, HashtagType } from "./interface";
import { Hashtag } from "./hashtagModel";

export class HashtagService implements IHashtagService {
    async add(params: HashtagType): Promise<Hashtag> {
        let hashtagText = params.hashtag_name
        hashtagText = hashtagText.replace(/\s/g, '')

        hashtagText = hashtagText.charAt(0) != '#' ? '#' + hashtagText : hashtagText

		const hashtag = await Hashtag.create({
            hashtag_name: hashtagText,
            user_information_id: params.user_information_id
		})
		return hashtag
	}
    
    async list (): Promise<Hashtag[]> {
        const hashtags = await Hashtag.findAll()
        
        return hashtags
    }

    async fetchById (id: number): Promise<Hashtag[]> {
        const hashtags = await Hashtag.findAll({
            where: {
                user_information_id: id
            }
        })

        return hashtags as any
    }

    async update (id: number, params: HashtagType): Promise<[affectedCount: number]> {
        let hashtagText = params.hashtag_name
        hashtagText = hashtagText.replace(/\s/g, '')
        hashtagText = hashtagText.charAt(0) != '#' ? '#' + hashtagText : hashtagText

        const updatedRow = await Hashtag.update({
            hashtag_name: hashtagText,
            user_information_id: params.user_information_id
        },
        {
            where: {
                id: id
            }
        })

        return updatedRow
    }

    async delete (id: number): Promise<number> {
        const deletedRow = await Hashtag.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}
