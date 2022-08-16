import { UserFCMTokens } from './userFCMTokensModel'
import { IUserFCMTokenService, Messages  } from './interface'
import { GffError } from '../helper/errorHandler'
import { Op } from 'sequelize'

export class UserFCMTokenService implements IUserFCMTokenService {

  constructor () {}

  addFcmToken = async (userId: number, token: string): Promise<UserFCMTokens> => {

    const fcmToken = await UserFCMTokens.findOne({
      where: { token },
    })

    if(fcmToken) {
      const error = new GffError(Messages.TOKEN_EXISTS)
      error.errorCode = '412'
      throw error
    }

    return UserFCMTokens.create({
      user_id: userId,
      token: token
    })
  }

  getUserTokens = async (userId: number | number[]): Promise<UserFCMTokens[]> => {

    const fcmToken = await UserFCMTokens.findAll({
      where: {
        user_id: {
          [Op.in]: Array.isArray(userId) ? userId : [userId]
        }
      },

    })

    if(!fcmToken) {
      const error = new GffError(Messages.TOKEN_NOT_FOUND)
      error.errorCode = '404'
      throw error
    }

    return fcmToken;
  }

  deleteFcmToken = async (userId: number, token: string): Promise<void> => {

    const fcmToken = await UserFCMTokens.findOne({
      where: { token, user_id: userId },
    })

    if(!fcmToken) {
      const error = new GffError(Messages.TOKEN_NOT_FOUND)
      error.errorCode = '404'
      throw error
    }

    return fcmToken.destroy()
  }
}
