import React, { PropTypes } from 'react'
import javascript_time_ago from 'javascript-time-ago'

export default class Time_ago extends React.Component
{
	static propTypes =
	{
		locale           : PropTypes.string,
		date             : PropTypes.instanceOf(Date),
		time             : PropTypes.number,
		style            : PropTypes.any,
		full             : PropTypes.func,
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
			minute       : 'numeric',
			second       : 'numeric',
			timeZoneName : 'short'
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

		if (!global._react_time_ago)
		{
			function update_relative_times()
			{
				for (let component of global._react_time_ago._components)
				{
					component.forceUpdate()
				}

				global._react_time_ago._timer = setTimeout(update_relative_times, props.update_interval)
			}

			const _react_time_ago =
			{
				_components : [],
				_register   : component => _react_time_ago._components.push(component),
				_unregister : component => _react_time_ago._components.remove(component),
				_destroy: () =>
				{
					_react_time_ago._components = []
					clearTimeout(_react_time_ago._timer)
					delete global._react_time_ago
				}
			}

			global._react_time_ago = _react_time_ago

			if (global.window)
			{
				update_relative_times()
			}
		}

		if (!global._react_time_ago[locale])
		{
			global._react_time_ago[locale] = 
			{
				javascript_time_ago : new javascript_time_ago(locale),
				date_time_formatter : new Intl.DateTimeFormat(locale, this.props.date_time_format)
			}
		}

		this.time_ago            = global._react_time_ago[locale].javascript_time_ago
		this.date_time_formatter = global._react_time_ago[locale].date_time_formatter

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

		let tip

		if (this.props.full)
		{
			tip = this.props.full(time || date)
		}
		else
		{
			tip = this.date_time_formatter(time || date)
		}

		const markup =
		(
			<span 
				title={tip} 
				style={css_style} 
				className={className}>

				{this.time_ago.format(time || date, this.formatter_style)}
			</span>
		)

		return markup
	}

	format_date(input)
	{
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
		global._react_time_ago._register(this)
	}

	unregister()
	{
		global._react_time_ago._unregister(this)
	}
}
