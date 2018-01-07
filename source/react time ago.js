import React from 'react'
import PropTypes from 'prop-types'

import shallow_equal from './shallow equal'
import { start_time_updater, get_time_updater } from './updater'
import Time_ago from './time ago'
import Date_time_formatter from './date time formatter'

export default class React_time_ago extends React.Component
{
	static propTypes =
	{
		locale           : PropTypes.string,
		locales          : PropTypes.arrayOf(PropTypes.string),
		children         : PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
		// `javascript-time-ago` relative time formatting style
		timeStyle        : PropTypes.any,
		// Legacy property name
		time_style       : PropTypes.any,
		// (optional) Tooltip date formatter
		full             : PropTypes.func,
		// Intl.DateTimeFormat options
		dateTimeFormat   : PropTypes.object.isRequired,
		// Legacy property name
		date_time_format : PropTypes.object,
		updateInterval   : PropTypes.number.isRequired,
		// Legacy property name
		update_interval  : PropTypes.number,
		wrapper          : PropTypes.func,
		tick             : PropTypes.bool.isRequired,
		style            : PropTypes.object,
		className        : PropTypes.string
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
		updateInterval: 60 * 1000,

		// Refreshes time in a web browser by default
		tick: true
	}

	static contextTypes =
	{
		intl: PropTypes.object
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
		this.time_ago            = new Time_ago(this.get_preferred_locales())
		this.date_time_formatter = new Date_time_formatter(this.time_ago.locale, date_time_format)
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
			wrapper,
			time_style,
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
				title={ wrapper ? undefined : full_date } 
				style={ style } 
				className={ className }>

				{ this.time_ago.format(time || date, time_style || timeStyle) }
			</time>
		)

		if (wrapper)
		{
			return React.createElement(wrapper, { verbose: full_date }, markup)
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