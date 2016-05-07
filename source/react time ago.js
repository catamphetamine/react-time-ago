import React, { PropTypes } from 'react'
import javascript_time_ago from 'javascript-time-ago'

const global_scope = typeof window !== 'undefined' ? window : global

export default class Time_ago extends React.Component
{
	static propTypes =
	{
		locale           : PropTypes.string,
		date             : PropTypes.instanceOf(Date),
		// If `date` is not specified
		time             : PropTypes.number,
		style            : PropTypes.any,
		// (optional) Tooltip date formatter
		full             : PropTypes.func,
		// Intl.DateTimeFormat options
		date_time_format : PropTypes.object,
		update_interval  : PropTypes.number,
		css_style        : PropTypes.object,
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

		let { locale, style } = props

		if (!locale)
		{
			// supports `react-intl`
			if (context.intl)
			{
				locale = context.intl.locale
			}
		}

		if (!locale)
		{
			throw new Error(`No locale specified for react-time-ago`)
		}

		if (!global_scope._react_time_ago)
		{
			create_react_time_ago(props.update_interval)
		}

		if (!global_scope._react_time_ago[locale])
		{
			global_scope._react_time_ago[locale] = 
			{
				javascript_time_ago : new javascript_time_ago(locale),
				date_time_formatter : new Intl.DateTimeFormat(locale, props.date_time_format)
			}
		}

		this.time_ago            = global_scope._react_time_ago[locale].javascript_time_ago
		this.date_time_formatter = global_scope._react_time_ago[locale].date_time_formatter

		if (style)
		{
			if (typeof style === 'string')
			{
				if (this.time_ago.style[style])
				{
					this.formatter_style = this.time_ago.style[style]()
				}
			}
			else if (typeof style === 'object')
			{
				this.formatter_style = style
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState)
	{
		return nextProps.date !== this.props.date 
			|| nextProps.time !== this.props.time
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
		const { time, date, tooltip, css_style, className } = this.props

		if (!(time || date))
		{
			throw new Error(`You are required to specify either "time" or "date" for react-time-ago component`)
		}

		const markup =
		(
			<span 
				title={this.full_date(time || date)} 
				style={css_style} 
				className={className}>

				{this.time_ago.format(time || date, this.formatter_style)}
			</span>
		)

		return markup
	}

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
			this._components.remove(component)

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