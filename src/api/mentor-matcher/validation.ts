import { query } from "express-validator"

export const requiredMentorId =
  query("mentor_id").exists().isNumeric().withMessage("Mentor id is required!")

export const requiredMenteeId =
  query("mentee_id").exists().isNumeric().withMessage("Mentee id is required!")

export const requiredRequestId =
  query("request_id").exists().isNumeric().withMessage("Request id is required!")