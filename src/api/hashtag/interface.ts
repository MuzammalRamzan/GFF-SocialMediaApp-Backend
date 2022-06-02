import { Request } from "express"
import { Hashtag } from "./hashtagModel"

export type HashtagType = {
    id: number
    hashtag_name: string
    user_information_id: number
}

export interface IHashtagService {
    add (params:HashtagType): Promise<Hashtag>
    list (): Promise<Hashtag[]>
    fetchById (id: number): Promise<Hashtag[]>
    update (id: number, params: HashtagType): Promise<[affectedCount: number]>
    delete (id: number): Promise<number>
}

export interface CreateHashtagRequest extends Request{
    HashtagType: HashtagType
}

export interface GetHashtagByUserInformationIdRequest extends Request{
    HashtagType: HashtagType
}

export interface UpdateHashtagRequest extends Request{
    id: number
    HashtagType: HashtagType
}

export interface DeleteHashtagRequest extends Request{
    id: number
}
