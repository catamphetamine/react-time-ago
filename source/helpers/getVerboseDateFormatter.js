import memoize from 'memoize-one'

import {
	intlDateTimeFormatSupported,
	intlDateTimeFormatSupportedLocale
} from './locale'

import Cache from './cache'

const cache = new Cache()

const INTL_DATE_TIME_FORMAT_SUPPORTED = intlDateTimeFormatSupported()
const FALLBACK_VERBOSE_DATE_FORMATTER = date => date.toString()

/**
 * Returns a verbose date formatter.
 * 
 * @param {string} locale - Date formatting locale
 * @param {object} format - Output format
 * @param {string} format.day     - Day format
 * @param {string} format.month   - Month format
 * @param {string} format.year    - Year format
 * @param {string} format.weekday - Weekday format
 * @param {string} format.hour    - Hour format
 * @param {string} format.minute  - Minute format
 * @param {string} format.second  - Second format
 *
 * @returns {Function} `(date) -> string`.
 */
function getVerboseDateFormatter(locales, format) {
	// Fall back to `date.toString()` for old web browsers.
	// https://caniuse.com/#search=intl
	if (!INTL_DATE_TIME_FORMAT_SUPPORTED) {
		return FALLBACK_VERBOSE_DATE_FORMATTER
	}

	// If none of the `locales` are supported
	// a default system locale will be used.
	const locale = resolveLocale(locales)

	// `Intl.DateTimeFormat` format caching key.
	// E.g. `"{"day":"numeric","month":"short",...}"`.
	// Didn't benchmark what's faster:
	// creating a new `Intl.DateTimeFormat` instance
	// or stringifying a small JSON `format`.
	// Perhaps strigifying JSON `format` is faster.
	const formatFingerprint = JSON.stringify(format)

	// Get `Intl.DateTimeFormat` instance for these `locale` and `format`.
	// (`locale` can be `undefined`, hence the `String(locale)` conversion)
	const formatter = cache.get(String(locale), formatFingerprint) ||
		cache.put(String(locale), formatFingerprint, new Intl.DateTimeFormat(locale, format))

	// Return date formatter
	return date => formatter.format(date)
}

// Even though `getVerboseDateFormatter()` function is called inside a
// `useMemo()` hook, it's still invoked every time for different 
// `<ReactTimeAgo/>` elements on a page. There could be a lot of such
// `<ReactTimeAgo/>` elements on a page. And `useMemo()` wouldn't speed up
// the initial render. To work around that, simple argument-based memoization
// is used.
export default memoize(getVerboseDateFormatter)

// Caching locale resolving for optimizing pages 
// with a lot of `<ReactTimeAgo/>` elements (say, 100 or more).
// `Intl.DateTimeFormat.supportedLocalesOf(locales)` is not instantaneous.
// For example, it could be 25 milliseconds for 200 calls.
const resolvedLocales = {}

/**
 * Resolves a list of possible locales to a single ("best fit") supported locale.
 * @param  {string[]} locales
 * @return {string}
 */
function resolveLocale(locales) {
	const localesFingerprint = locales.toString()
	if (resolvedLocales[localesFingerprint]) {
		return resolvedLocales[localesFingerprint] 
	}
	return resolvedLocales[localesFingerprint] = intlDateTimeFormatSupportedLocale(locales)
}