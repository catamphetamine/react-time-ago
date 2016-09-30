import React, { PropTypes } from 'react'
import javascript_time_ago from 'javascript-time-ago'
import shallow_compare from 'react-addons-shallow-compare'

const global_scope = typeof window !== 'undefined' ? window : global

export default class Time_ago extends React.Component
{
	static propTypes =
	{
		locale           : PropTypes.string,
		children         : PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
		// `javascript-time-ago` relative time formatting style
		time_style       : PropTypes.any,
		// (optional) Tooltip date formatter
		full             : PropTypes.func,
		// Intl.DateTimeFormat options
		date_time_format : PropTypes.object,
		update_interval  : PropTypes.number,
		wrapper          : PropTypes.func,
		style            : PropTypes.object,
		className        : PropTypes.string
	}

	static defaultProps =
	{
		// Thursday, December 20, 2012, 7:00:00 AM GMT+4
		date_time_format:
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
		update_interval: 60 * 1000
	}

	static contextTypes =
	{
		intl: React.PropTypes.object
	}

	constructor(props, context)
	{
		super(props, context)

		let { locale, time_style, date_time_format, update_interval } = props

		// If `locale` was not explicitly set
		// then try to derive it from `react-intl` context
		if (!locale)
		{
			// supports `react-intl`
			if (context.intl)
			{
				locale = context.intl.locale
			}
		}

		// If no locale is set, then throw an error
		if (!locale)
		{
			throw new Error(`No locale specified for react-time-ago`)
		}

		// `_react_time_ago` holds cached formatters
		// and the global refresh timer
		if (!global_scope._react_time_ago)
		{
			create_react_time_ago(update_interval)
		}

		// `Intl.DateTimeFormat` verbose formatter caching key
		const date_time_format_id = JSON.stringify(date_time_format)

		// Cache `javascript-time-ago` formatter
		if (!global_scope._react_time_ago[locale])
		{
			global_scope._react_time_ago[locale] = 
			{
				javascript_time_ago : new javascript_time_ago(locale),
				date_time_formatter : {}
			}
		}

		// This `locale` entry in the cache
		const locale_cache = global_scope._react_time_ago[locale]

		// Cache `Intl.DateTimeFormat` verbose formatter
		if (!locale_cache.date_time_formatter[date_time_format_id])
		{
			locale_cache.date_time_formatter[date_time_format_id] = new Intl.DateTimeFormat(locale, date_time_format)
		}

		// Take `javascript-time-ago` formatter and 
		// `Intl.DateTimeFormat` verbose formatter from cache
		this.time_ago            = locale_cache.javascript_time_ago
		this.date_time_formatter = locale_cache.date_time_formatter[date_time_format_id]

		// Get time formatting style object by name
		if (time_style)
		{
			if (typeof time_style === 'string')
			{
				if (this.time_ago.style[time_style])
				{
					this.formatter_style = this.time_ago.style[time_style]()
				}
			}
			else if (typeof time_style === 'object')
			{
				this.formatter_style = time_style
			}
			else
			{
				throw new Error(`Unknown time formatter style: ${time_style}`)
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState)
	{
		return shallow_compare(this, nextProps, nextState)
	}

	componentDidMount()
	{
		this.register()
	}

	componentWillUnmount()
	{
		this.unregister()
	}

	render()
	{
		const { children, tooltip, wrapper, style, className } = this.props

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
				dateTime={(date || new Date(time)).toISOString()}
				title={wrapper ? undefined : full_date} 
				style={style} 
				className={className}>

				{this.time_ago.format(time || date, this.formatter_style)}
			</time>
		)

		if (wrapper)
		{
			return React.createElement(wrapper, { verbose: full_date }, markup)
		}

		return markup
	}

	// Verbose date string.
	// Is used as a tooltip text.
	//
	// E.g. "Sunday, May 18th, 2012, 18:45"
	//
	full_date(input)
	{
		if (this.props.full)
		{
			return this.props.full(input)
		}

		let date

		if (input.constructor === Date)
		{
			date = input
		}
		else if (typeof input === 'number')
		{
			date = new Date(input)
		}
		else
		{
			throw new Error(`Unsupported react-time-ago input: ${typeof input}, ${input}`)
		}

		return this.date_time_formatter.format(date)
	}

	register()
	{
		global_scope._react_time_ago._register(this)
	}

	unregister()
	{
		global_scope._react_time_ago._unregister(this)
	}
}

function start_relative_times_updater(update_interval)
{
	function update_relative_times(dry_run)
	{
		if (!dry_run)
		{
			for (let component of global_scope._react_time_ago._components)
			{
				component.forceUpdate()
			}
		}

		global_scope._react_time_ago._timer = setTimeout(update_relative_times, update_interval)
	}

	update_relative_times(true)
}

function stop_relative_times_updater()
{
	if (global_scope._react_time_ago._timer)
	{
		clearTimeout(global_scope._react_time_ago._timer)
		global_scope._react_time_ago._timer = undefined
	}
}

function create_react_time_ago(update_interval)
{
	const _react_time_ago =
	{
		_components : [],
		_register(component)
		{
			this._components.push(component)

			// If it's the first relative time component,
			// start periodical time refresh.
			if (this._components.length === 1)
			{
				start_relative_times_updater(update_interval)
			}
		},
		_unregister(component)
		{
			remove_element_from_array(this._components, component)

			// If it was the last relative time component,
			// stop periodical time refresh.
			if (this._components.length === 0)
			{
				stop_relative_times_updater()
			}
		},
		_destroy()
		{
			for (let component of this._components)
			{
				this._unregister(component)
			}

			delete global_scope._react_time_ago
		}
	}

	global_scope._react_time_ago = _react_time_ago
}

function remove_element_from_array(array, element)
{
	const index = array.indexOf(element)
	if (index >= 0)
	{
		array.splice(index, 1)
	}
	return array
}