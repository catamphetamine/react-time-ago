import React from 'react'
import PropTypes from 'prop-types'
import JavascriptTimeAgo from 'javascript-time-ago'

import shallow_equal from './shallow equal'
import { start_time_updater, get_time_updater } from './updater'
import DateTimeFormatter from './date time formatter'

export default class React_time_ago extends React.Component
{
	static propTypes =
	{
		// Preferred locale.
		// E.g. 'ru-RU'.
		locale : PropTypes.string,

		// Preferred locales (ordered).
		// E.g. `['ru-RU', 'en-GB']`.
		locales : PropTypes.arrayOf(PropTypes.string),

		// The date to format.
		// Alternatively can be passed as a child.
		// E.g. `new Date()`.
		date : PropTypes.instanceOf(Date),

		// The date to format.
		// Alternatively can be passed as a child.
		// E.g. `1355972400000`.
		time : PropTypes.number,

		// Date/time formatting style.
		// E.g. 'twitter', 'fuzzy', or custom (`{ gradation: […], units: […], flavour: 'long', override: function }`)
		timeStyle : PropTypes.oneOfType
		([
			PropTypes.string,
			PropTypes.shape
			({
				gradation : PropTypes.arrayOf(PropTypes.shape
				({
					name        : PropTypes.string.isRequired,
					granularity : PropTypes.number,
					factor      : PropTypes.number,
					threshold   : PropTypes.number,
					// Specific `threshold_[unit]` properties may also be defined
				})),
				units    : PropTypes.arrayOf(PropTypes.string),
				flavour  : PropTypes.string,
				override : PropTypes.func
			})
		]),

		// An optional function returning what will be output in the HTML `title` tooltip attribute.
		// (by default it's (date) => new Intl.DateTimeFormat(locale, {…}).format(date))
		full : PropTypes.func,

		// `Intl.DateTimeFormat` format for the HTML `title` tooltip attribute.
		// Is used when `full` is not specified.
		// By default outputs a verbose full date.
		dateTimeFormat : PropTypes.object,

		// How often to update all `<ReactTimeAgo/>`s on a page.
		// (once a minute by default)
		updateInterval : PropTypes.number,

		// Set to `false` to disable automatic refresh as time goes by.
		tick : PropTypes.bool,

		// React Component to wrap the resulting `<time/>` React Element.
		// Can be used for displaying time in an "on mouse over" tooltip.
		container : PropTypes.func,

		// CSS `style` object.
		// E.g. `{ color: white }`.
		style : PropTypes.object,

		// CSS class name
		className : PropTypes.string,

		children : PropTypes.oneOfType
		([
			PropTypes.instanceOf(Date),
			PropTypes.number
		]),
	}

	static defaultProps =
	{
		locales : [],

		// Thursday, December 20, 2012, 7:00:00 AM GMT+4
		dateTimeFormat:
		{
			weekday      : 'long',
			day          : 'numeric',
			month        : 'long',
			year         : 'numeric',
			hour         : 'numeric',
			minute       : '2-digit',
			second       : '2-digit',
			// timeZoneName : 'short'
		},

		// Updates once a minute
		updateInterval : 60 * 1000,

		// Refreshes time in a web browser by default
		tick : true
	}

	static contextTypes =
	{
		intl : PropTypes.object
	}

	state = {}

	constructor(props, context)
	{
		super(props, context)

		// Legacy property name support
		const date_time_format = this.props.date_time_format || this.props.dateTimeFormat
		const update_interval  = this.props.update_interval  || this.props.updateInterval

		// Automatically updates time in a web browser
		if (!get_time_updater())
		{
			start_time_updater(update_interval)
		}

		// Take `javascript-time-ago` formatter and 
		// `Intl.DateTimeFormat` verbose formatter from cache.
		this.time_ago            = new JavascriptTimeAgo(this.get_preferred_locales())
		this.date_time_formatter = new DateTimeFormatter(this.time_ago.locale, date_time_format)
	}

	shouldComponentUpdate(nextProps, nextState)
	{
		return !shallow_equal(this.props, nextProps) || !shallow_equal(this.state, nextState)
	}

	componentDidMount()
	{
		const { tick } = this.props

		if (tick)
		{
			// Register for the relative time autoupdate as the time goes by
			this.stop_autoupdate = get_time_updater().add(() =>
			{
				this.setState
				({
					updatedAt: Date.now()
				})
			})
		}
	}

	componentWillUnmount()
	{
		if (this.stop_autoupdate)
		{
			this.stop_autoupdate()
		}
	}

	render()
	{
		const
		{
			children,
			container,
			timeStyle,
			style,
			className
		}
		= this.props

		if (!children)
		{
			throw new Error(`You are required to specify either a timestamp (in milliseconds) or Date as a child of react-time-ago component`)
		}

		const full_date = this.full_date(children)

		const date = children instanceof Date && children
		const time = typeof children === 'number' && children

		const markup =
		(
			<time
				dateTime={ (date || new Date(time)).toISOString() }
				title={ container ? undefined : full_date } 
				style={ style } 
				className={ className }>

				{ this.time_ago.format(time || date, timeStyle) }
			</time>
		)

		if (container)
		{
			return React.createElement(container, { verboseDate: full_date }, markup)
		}

		return markup
	}

	// Composes a list of preferred locales
	get_preferred_locales()
	{
		const { intl } = this.context

		const { locale } = this.props
		let { locales } = this.props

		// Convert `locale` to `locales`
		if (locale)
		{
			locales = [locale].concat(locales)
		}

		// Try to obtain fallback locale from `react-intl` context.
		if (intl)
		{
			locales = locales.concat(intl.locale)
		}

		return locales
	}

	// Verbose date string.
	// Is used as a tooltip text.
	//
	// E.g. "Sunday, May 18th, 2012, 18:45"
	//
	full_date(input)
	{
		const { full } = this.props

		if (full)
		{
			return full(input)
		}

		return this.date_time_formatter.format(get_input_date(input))
	}
}

// Converts input into a `Date`.
function get_input_date(input)
{
	if (input.constructor === Date)
	{
		return input
	}

	if (typeof input === 'number')
	{
		return new Date(input)
	}

	throw new Error(`Unsupported react-time-ago input: ${typeof input}, ${input}`)
}