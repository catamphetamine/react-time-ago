import memoize from 'memoize-one'

import {
	isIntlDateTimeFormatSupported,
	chooseOneSupportedLocale
} from './locale.js'

import FullDateFormatter from './FullDateFormatter.js'
import Cache from './cache.js'

const cache = new Cache()

// `Intl` is supported in all modern web browsers.
// https://caniuse.com/#search=intl
const INTL_DATE_TIME_FORMAT_IS_SUPPORTED = isIntlDateTimeFormatSupported()

/**
 * Returns a verbose date formatter.
 *
 * @param {(string|string[])} locale - `locale` or `locales`
 * @param {object} [format] - Output format
 * @param {string} [format.day]     - Day format
 * @param {string} [format.month]   - Month format
 * @param {string} [format.year]    - Year format
 * @param {string} [format.weekday] - Weekday format
 * @param {string} [format.hour]    - Hour format
 * @param {string} [format.minute]  - Minute format
 * @param {string} [format.second]  - Second format
 *
 * @returns {Function} `(date) -> string`.
 */
function getVerboseDateFormatter(locales, format) {
	// Chooses one `locale` from the list of `locales`.
	//
	// If none of the `locales` are supported,
	// `locale` will be `undefined` and a default system locale will be used.
	//
	const locale = chooseLocale(locales)

	// Create a formatter cache key.
	// Example: `"{"day":"numeric","month":"short",...}"` or `"undefined"`.
	// I didn't really test what's faster:
	// creating a new `Intl.DateTimeFormat` instance or calling `JSON.stringify(format)`.
	// Perhaps `JSON.stringify(format)` is faster.
	const formatFingerprint = JSON.stringify(format)

	// Creates a date formatter instance.
	const createFormatter = () => {
		if (format && INTL_DATE_TIME_FORMAT_IS_SUPPORTED) {
			return new Intl.DateTimeFormat(locale, format)
		}
		return new FullDateFormatter(locale)
	}

	// Get a formatter instance for these `locale` and `format`.
	// (`locale` can be `undefined`, hence the `String(locale)` conversion)
	const formatter = cache.get(String(locale), formatFingerprint) ||
		cache.put(String(locale), formatFingerprint, createFormatter())

	// Return date formatter function.
	return (date) => formatter.format(date)
}

// Even though `getVerboseDateFormatter()` function is called inside a
// `useMemo()` hook, it's still invoked every time for a different
// `<ReactTimeAgo/>` element on a page. There could be a lot of such
// `<ReactTimeAgo/>` elements on a page — hundreds or more — and `useMemo()` hook
// only speeds up subsequent renders and doesn't speed up the initial render,
// so the initial render could still potentially affect the performance of the page.
// To work around that, simple argument-based memoization is used here.
export default memoize(getVerboseDateFormatter)

// A cache for `chooseLocale()` function results.
// A cache was introduced because `Intl.DateTimeFormat.supportedLocalesOf(locales)`
// calls aren't instantaneous. One call is fine but hundreds in a row might be noticeable.
// For example, if there's a page with a lot of `<ReactTimeAgo/>` elements on it (say, 100 or more),
// the total execution time of calling `chooseLocale()` 100 times in a row could be about 10 milliseconds.
const choosenLocaleCache = {}

/**
 * Picks a single ("best fit") supported locale from the list of `locales`.
 * @param  {string[]} locales
 * @return {string}
 */
function chooseLocale(locales) {
	const localesFingerprint = locales.toString()
	if (choosenLocaleCache[localesFingerprint]) {
		return choosenLocaleCache[localesFingerprint]
	}
	return choosenLocaleCache[localesFingerprint] = chooseOneSupportedLocale(locales)
}