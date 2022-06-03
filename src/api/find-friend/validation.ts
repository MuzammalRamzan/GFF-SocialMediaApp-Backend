import { body } from "express-validator"

export const createNewFriendRequestValidation = [
  body('receiver_id').notEmpty().isInt().bail().withMessage('receiver_id must be an integer')
]