import cache from './cache'

/**
 * The whole purpose of this class is caching the formatter.
 * I didn't measure the performance impact but I guess it would be
 * reasonable in case of many `<ReactTimeAgo/>` components on a page,
 * not to mention server side which caches the formats once and forever.
 * Since both web browser and Node.js are single-threaded
 * such caching approach is safe.
 */
export default class DateTimeFormatter
{
	/**
	 * @param {string} locale - Date formatting locale
	 * @param {object} format - Formatted date format
	 * @param {string} format.day     - Day format
	 * @param {string} format.month   - Month format
	 * @param {string} format.year    - Year format
	 * @param {string} format.weekday - Weekday format
	 * @param {string} format.hour    - Hour format
	 * @param {string} format.minute  - Minute format
	 * @param {string} format.second  - Second format
	 */
	constructor(locale, format)
	{
		// `Intl.DateTimeFormat` format caching key.
		// E.g. `"{"day":"numeric","month":"short",...}"`.
		const format_fingerprint = JSON.stringify(format)

		// Cache `Intl.DateTimeFormat` for these `locale` and `format`.
		this.formatter = cache.get(locale, format_fingerprint) ||
			cache.put(locale, format_fingerprint, new Intl.DateTimeFormat(locale, format))
	}

	/**
	 * Formats the date
	 * @param {Date} date
	 */
	format(date)
	{
		return this.formatter.format(date)
	}
}
