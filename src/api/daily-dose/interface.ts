import { Request } from 'express'
import { UserType } from '../user/interface'
import { DailyDose } from './dailyDoseModel'

export type DailyDoseType = {
	id: number
  title: string,
  subtitle: string,
  image: string,
  contentURL: string,
  keyWord: string,
  category:string
}

export interface IDailyDoseType {
	add(params: DailyDoseType): Promise<DailyDose>
}


export interface createDoseRequest extends Request {
  DebtType: DailyDoseType,
  user: UserType
}