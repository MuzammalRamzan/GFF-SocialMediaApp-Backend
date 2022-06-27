import { IDailyDoseType, DailyDoseType } from "./interface";
import { DailyDose } from "./dailyDoseModel";

export class DailyDoseService implements IDailyDoseType {

    async add(params: DailyDoseType): Promise<DailyDose> {
		const dailyDose = await DailyDose.create({
      title: params.title,
      subtitle: params.subtitle,
      image: params.image,
      contentURL: params.contentURL,
      keyWord: params.keyWord,
      category: params.category,
    })
		return dailyDose
    }
  async findByCategory(category: string): Promise<DailyDose[]> {
    const dailyDose = await DailyDose.findAll({
          where: {
            category: category
          }
      })

      if (!dailyDose){
          throw new Error("Unauthorized")
      }

      return dailyDose;
  }
  async update(paramsId: number, params: DailyDoseType): Promise<DailyDose> {
		await DailyDose.update(
			{
			title: params.title,
      subtitle: params.subtitle,
      image: params.image,
      contentURL: params.contentURL,
      keyWord: params.keyWord,
      category: params.category,
			},
			{
				where: {
					id: paramsId
				}
			}
		)

		const newUpdatedRow = await DailyDose.findByPk(paramsId)
		return newUpdatedRow as DailyDose
  }
  async delete (id: number): Promise<number> {
    const deletedRow = await DailyDose.destroy({
        where: {
            id: id
        }
    })
    if(!deletedRow){
        throw new Error("No data found against this ID")
    }

    return deletedRow
  }
  async findAllCategory(category: string): Promise<DailyDose[]> {
    const dailyDose = await DailyDose.findAll()

      if (!dailyDose){
          throw new Error("Unauthorized")
      }

      return dailyDose;
  }
}