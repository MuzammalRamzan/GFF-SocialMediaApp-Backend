import { Op, where } from 'sequelize'
import { CREW_MEMBERS_FIELDS, CREW_MEMBER_USER_FIELD } from '../../helper/db.helper'
import { Crew } from '../crew/crewModel'
import { CrewMember } from '../crewMember/crewMemberModel'
import { Verification } from '../identity-verification/verification.model'
import { UserInformation } from '../user-information/userInformationModel'
import { Transaction } from '../transaction/transactionModel'

import { UserRole } from '../user-role/userRoleModel'
import { User } from '../user/userModel'
import { ApplyForLoanCreateType, ApplyForLoanType } from './interface'
import moment from 'moment'
import { ApplyForLoan } from './applyForLoanModel'

export class ApplyForLoanService {
	async checkEligibleForLoan(userId: number): Promise<ApplyForLoanType> {
		const user = await User.findByPk(userId)
		const userInfo = await UserInformation.findOne({ where: { user_id: userId } })
		const verification = await Verification.findOne({ where: { user_id: userId } })
		const crews = await CrewMember.findAll({ where: { user_id: userId, status: 'accepted' } })

		let maxMember = 0
		let crewIds = []
		for (let crew of crews) {
			crewIds.push(crew?.getDataValue('crew_id'))
			const crewMembers = await CrewMember.findAll({
				where: { crew_id: crew?.getDataValue('crew_id'), status: 'accepted' }
			})
			if (maxMember < crewMembers.length) {
				maxMember = crewMembers.length
			}
		}

		const crew = await Crew.findAll({
			where: { is_archived: false, id: crewIds },
			include: [
				{
					model: CrewMember,
					as: 'crew_members',
					attributes: CREW_MEMBERS_FIELDS,
					include: [
						{
							model: User,
							as: 'user',
							attributes: CREW_MEMBER_USER_FIELD,
							include: [
								{
									model: UserRole,
									as: 'role',
									where: { name: 'mentor' }
								}
							]
						}
					],
					where: { status: 'accepted' }
				}
			]
		})

		let mentorExist = false
		crew.map((c: any) => {
			c.crew_members.map((m: any) => {
				if (m.user) {
					mentorExist = true
				}
			})
		})

		const totalTransaction = await Transaction.count({ where: { user_id: userId } })

		const transaction = await Transaction.findOne({
			where: {
				user_id: userId,
				created_at: {
					[Op.lt]: moment().format(),
					[Op.gt]: moment().subtract(3, 'months').format()
				}
			}
		})

		return {
			phone_confirmed: userInfo?.getDataValue('phone_number_verified') || false,
			yoti_verification_passed: verification?.getDataValue('is_verified') ? true : false,
			is_premium: user?.getDataValue('is_pro') || false,
			has_crew: crews.length ? true : false,
			is_crew_valid: maxMember >= 4 ? true : false && mentorExist,
			has_bb: transaction ? true : false,
			is_bb_valid: totalTransaction >= 40 ? true : false,
			is_country_valid:
				userInfo?.getDataValue('country') == 'kenya' || userInfo?.getDataValue('country') == 'Kenya' ? true : false
		}
	}

	async applyForLoan(userId: number, params: ApplyForLoanCreateType): Promise<ApplyForLoan> {
		const applyForLoan = await ApplyForLoan.create({ ...params, user_id: userId })

		return applyForLoan
	}

	async loans(userId: number, roleId: number): Promise<ApplyForLoan[]> {
		const role = await UserRole.findByPk(roleId)

		let loans
		if (role?.getDataValue('name') === 'Admin') {
			loans = await ApplyForLoan.findAll({})
		} else {
			loans = await ApplyForLoan.findAll({ where: { user_id: userId } })
		}

		return loans
	}
}
