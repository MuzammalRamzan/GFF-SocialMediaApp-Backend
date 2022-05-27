import { body } from "express-validator"

export const createNewFriendRequestValidation = [
  body('sender_id').notEmpty().isInt().bail().withMessage('sender_id must be an integer'),
  body('receiver_id').notEmpty().isInt().bail().withMessage('receiver_id must be an integer')
]