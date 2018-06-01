import
{
	intlDateTimeFormatSupported,
	intlDateTimeFormatSupportedLocale
}
from 'javascript-time-ago'

import Cache from 'javascript-time-ago/cache'

const cache = new Cache()

/**
 * Creates verbose date formatter.
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
export default function createVerboseDateFormatter(locales, format)
{
	// Fall back to `date.toString()` for old web browsers.
	// https://caniuse.com/#search=intl
	if (!intlDateTimeFormatSupported())
	{
		return date => date.toString()
	}

	// If none of the `locales` are supported
	// a default system locale will be used.
	const locale = intlDateTimeFormatSupportedLocale(locales)

	// `Intl.DateTimeFormat` format caching key.
	// E.g. `"{"day":"numeric","month":"short",...}"`.
	// Didn't benchmark what's faster:
	// creating a new `Intl.DateTimeFormat` instance
	// or stringifying a small JSON `format`.
	// Perhaps strigifying JSON `format` is faster.
	const format_fingerprint = JSON.stringify(format)

	// Get `Intl.DateTimeFormat` instance for these `locale` and `format`.
	// (`locale` can be `undefined` therefore `String(locale)`)
	const formatter = cache.get(String(locale), format_fingerprint) ||
		cache.put(String(locale), format_fingerprint, new Intl.DateTimeFormat(locale, format))

	// Return date formatter
	return date => formatter.format(date)
}