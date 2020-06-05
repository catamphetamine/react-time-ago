/**
 * Converts value to a `Date`
 * @param {(number|Date)} value
 * @return {Date}
 */
export function getDate(value) {
	return isDate(value) ? value : new Date(value)
}

/**
 * Converts value to a timestamp.
 * @param {(number|Date)} value
 * @return {number}
 */
export function getTime(value) {
	return isDate(value) ? value.getTime() : value
}

function isDate(object) {
	return object instanceof Date || isMockedDate(object)
}

// During testing via some testing libraries `Date`s aren't actually `Date`s.
// https://github.com/catamphetamine/javascript-time-ago/issues/22
export function isMockedDate(object) {
	return typeof object === 'object' && typeof object.getTime === 'function'
}