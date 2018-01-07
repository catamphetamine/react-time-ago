import javascript_time_ago from 'javascript-time-ago'

const global_scope = typeof window !== 'undefined' ? window : global

function get_formatters()
{
	return global_scope._time_ago_formatters
}

function set_formatters(object)
{
	global_scope._time_ago_formatters = object
}

// An instance of this class formats a `date` with a
// `javascript-time-ago` formatter given a `time_style`:
// `new TimeAgo(['ru-RU']).format(new Date(), 'twitter')`
//
// The purpose of this class is also caching `javascript-time-ago` formatters.
// I didn't measure the performance impact but I guess it would be
// substantial in case of many `<ReactTimeAgo/>` components on a page,
// not to mention server side which caches the formatters once and forever.
//
export default class TimeAgo
{
	// Caches string to object formatting style mapping
	formatter_styles = {}

	constructor(locales)
	{
		// Legacy argument
		if (typeof locales === 'string')
		{
			locales = [locales]
		}

		const locale = this.locale = javascript_time_ago.choose_locale(locales)

		// Formatters
		if (!get_formatters())
		{
			set_formatters({})
		}

		// Cache `javascript-time-ago` formatter for this locale
		if (!get_formatters()[locale])
		{
			get_formatters()[locale] = new javascript_time_ago([locale])
		}

		this.formatter = get_formatters()[locale]
	}

	// Formats a `date` with a `javascript-time-ago` formatter given a `time_style`:
	// `new TimeAgo('ru-RU').format(new Date(), 'twitter')`
	format(date, time_style)
	{
		return this.formatter.format(date, this.parse_time_ago_style(time_style))
	}

	// Converts a string time style (e.g. "twitter") into an object one.
	// See `javascript-time-ago` docs for more info on time style.
	parse_time_ago_style(time_style)
	{
		if (!time_style)
		{
			return
		}

		// Convert a string style into an object one (and cache it)
		if (typeof time_style === 'string')
		{
			if (!this.formatter_styles[time_style])
			{
				this.formatter_styles[time_style] = this.formatter.style[time_style]()
			}

			return this.formatter_styles[time_style]
		}

		if (typeof time_style === 'object')
		{
			return time_style
		}

		throw new Error(`Unknown time formatter style: ${time_style}`)
	}
}