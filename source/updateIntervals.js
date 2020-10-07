// Stupid Rollup doesn't know how to property read "default" export.

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY

// For standard `timeStyle`s, "smart" autoupdate interval is used:
// every minute for the first hour, then every 10 minutes for the first 12 hours, and so on.
// "Smart" autoupdate intervals should be moved to `javascript-time-ago`'s grading scale.
export default [{
	interval: MINUTE
}, {
	threshold: HOUR,
	interval: 10 * MINUTE
}, {
	threshold: 12 * HOUR,
	interval: 20 * MINUTE
}, {
	threshold: DAY,
	interval: 3 * HOUR
}, {
	threshold: 7 * DAY,
	interval: 6 * HOUR
}, {
	threshold: MONTH,
	interval: 5 * DAY
}, {
	threshold: 3 * MONTH,
	interval: 10 * DAY
}, {
	threshold: YEAR,
	interval: MONTH
}]