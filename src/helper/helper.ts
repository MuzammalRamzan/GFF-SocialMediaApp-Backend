export const getHaversine = (_latitude: number, _longitude: number): string =>
	`(6371 * acos(cos(radians(${_latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${_longitude})) + sin(radians(${_latitude})) * sin(radians(latitude))))`
