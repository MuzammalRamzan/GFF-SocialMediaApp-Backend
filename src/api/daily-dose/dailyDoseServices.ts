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
}