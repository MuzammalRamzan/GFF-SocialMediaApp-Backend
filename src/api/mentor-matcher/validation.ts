import { query, body, check } from "express-validator"

export const requiredMentorId =
  check("mentor_id").exists().isNumeric().withMessage("Mentor id is required!")

export const requiredMenteeId =
  check("mentee_id").exists().isNumeric().withMessage("Mentee id is required!")

export const requiredRequestId =
  check("request_id").exists().isNumeric().withMessage("Request id is required!")

export const sendMentorRequestValidation = [
  body('mentor_id').exists().isNumeric().withMessage("Mentor id is required!"),
  body('message').exists().isString().withMessage("Message is required!")
]