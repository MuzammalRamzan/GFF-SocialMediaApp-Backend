import moment from 'moment'

type defaultReplacementType = { [key: string]: string }

const defaultReplacement: defaultReplacementType = {
	transaction_account: 'account',
	transaction_category: 'category'
}

export const ObjectParser = (currentObj: any, newObj: any, current?: string) => {
	const obj = currentObj
	const res = newObj
	for (let key in obj) {
		let value = obj[key]

		if (current && defaultReplacement[current]) current = defaultReplacement[current]

		let newKey = current ? current + '_' + key : key // joined key with dot

		if (value && typeof value === 'object' && value.length === undefined && value instanceof Date !== true) {
			ObjectParser(value, res, key) // it's a nested object, so do it again
		} else {
			res[newKey] = value // it's not an object, so set the property
		}
	}
}
