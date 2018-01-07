const global_scope = typeof window !== 'undefined' ? window : global

function get_formatters()
{
	return global_scope._date_time_formatters
}

function set_formatters(object)
{
	global_scope._date_time_formatters = object
}

// Creates a `new Intl.DateTimeFormat()` (and caches it).
//
// The whole purpose of this class is caching the formatter.
// I didn't measure the performance impact but I guess it would be
// substantial in case of many `<ReactTimeAgo/>` components on a page,
// not to mention server side which caches the formats once and forever.
//
// An instance of this class has a `.format(date)` method.
//
export default class DateTimeFormatter
{
	constructor(locale, format)
	{
		if (!get_formatters())
		{
			set_formatters({})
		}

		// Formatters for this locale
		if (!get_formatters()[locale])
		{
			get_formatters()[locale] = {}
		}

		// `Intl.DateTimeFormat` format caching key.
		// E.g. `"{"day":"numeric","month":"short",...}"`.
		const format_id = JSON.stringify(format)

		// Cache `Intl.DateTimeFormat` for this locale
		if (!get_formatters()[locale][format_id])
		{
			get_formatters()[locale][format_id] = new Intl.DateTimeFormat(locale, format)
		}

		this.formatter = get_formatters()[locale][format_id]
	}

	format(date)
	{
		return this.formatter.format(date)
	}
}
