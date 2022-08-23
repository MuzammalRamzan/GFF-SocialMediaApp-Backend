import { WellnessWarriorsCertificate } from './wellnessWarriorCertificateModel'

export type WellnessWarriorsCertificateParams = {
	wellness_warrior_id: number
	authority: string
	title: string
	year: number
	pdfFile: Express.Multer.File
}

export type WellnessWarriorsCertificateUpdateParams = {
	id: number
	wellness_warrior_id: number
	authority: string
	title: string
	year: number
	pdfFile: Express.Multer.File
}

export interface IWellnessWarriorsCertificateService {
	create(params: WellnessWarriorsCertificateParams): Promise<WellnessWarriorsCertificate>
	getAll(id: number): Promise<WellnessWarriorsCertificate[]>
	update(params: WellnessWarriorsCertificateUpdateParams): Promise<WellnessWarriorsCertificate | null>
}
