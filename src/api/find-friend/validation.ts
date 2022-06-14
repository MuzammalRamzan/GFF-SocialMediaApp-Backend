import { check } from "express-validator"

export const createNewFriendRequestValidation = [
  check('user_id').notEmpty().withMessage('user_id must be an integer')
]

export const acceptOrRejectFriendRequestValidation = [
  check('request_id').notEmpty().withMessage('request_id must be an integer')
]