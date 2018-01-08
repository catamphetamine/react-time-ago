import cache from './cache'

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
	const locale = choose_locale(locales)

	// If none of the `locales` are supported
	// return a simple fallback date formatter.
	if (!locale)
	{
		return date => date.toString()
	}

	// `Intl.DateTimeFormat` format caching key.
	// E.g. `"{"day":"numeric","month":"short",...}"`.
	const format_fingerprint = JSON.stringify(format)

	// Get `Intl.DateTimeFormat` instance for these `locale` and `format`.
	const formatter = cache.get(locale, format_fingerprint) ||
		cache.put(locale, format_fingerprint, new Intl.DateTimeFormat(locale, format))

	// Return date formatter
	return date => formatter.format(date)
}

/**
 * Chooses a supported locale from a list of preferred ones.
 * @param  {string[]} locales
 * @return {?string}
 */
function choose_locale(locales)
{
	if (typeof Intel === 'object' && Intl.DateTimeFormat)
	{
		return Intl.DateTimeFormat.supportedLocalesOf(locales)[0]
	}
}