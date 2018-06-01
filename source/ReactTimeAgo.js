import React, { Component } from 'react'
import PropTypes from 'prop-types'
import JavascriptTimeAgo from 'javascript-time-ago'
import { style } from 'javascript-time-ago/prop-types'

import shallowEqual from './shallowEqual'
import Periodic from './periodic'
import createVerboseDateFormatter from './verboseDateFormatter'

export default class ReactTimeAgo extends Component
{
	static propTypes =
	{
		// Preferred locale.
		// E.g. 'ru-RU'.
		locale : PropTypes.string,

		// Preferred locales (ordered).
		// E.g. `['ru-RU', 'en-GB']`.
		locales : PropTypes.arrayOf(PropTypes.string),

		// The `date` or `timestamp`.
		// E.g. `new Date()` or `1355972400000`.
		children : PropTypes.oneOfType
		([
			PropTypes.instanceOf(Date),
			PropTypes.number
		])
		.isRequired,

		// Date/time formatting style.
		// E.g. 'twitter', 'fuzzy', or custom (`{ gradation: […], units: […], flavour: 'long', custom: function }`)
		timeStyle : style,

		// Whether HTML `tooltip` attribute should be set
		// to verbosely formatted date (is `true` by default).
		tooltip : PropTypes.bool.isRequired,

		// An optional function returning what will be output in the HTML `title` tooltip attribute.
		// (by default it's (date) => new Intl.DateTimeFormat(locale, {…}).format(date))
		formatVerboseDate : PropTypes.func,

		// `Intl.DateTimeFormat` format for the HTML `title` tooltip attribute.
		// Is used when `formatVerboseDate` is not specified.
		// By default outputs a verbose date.
		verboseDateFormat : PropTypes.object,

		// How often to update all `<ReactTimeAgo/>`s on a page.
		// (once a minute by default)
		updateInterval : PropTypes.number,

		// Set to `false` to disable automatic refresh as time goes by.
		tick : PropTypes.bool,

		// React Component to wrap the resulting `<time/>` React Element.
		// Receives `verboseDate` and `children` properties.
		// `verboseDate` can be used for displaying verbose date label
		// in an "on mouse over" (or "on touch") tooltip.
		//
		// ```js
		// import React from 'react'
		// import ReactTimeAgo from 'react-time-ago'
		// import { Tooltip } from 'react-responsive-ui'
		// 
		// export default function TimeAgo(props) {
		//   return <ReactTimeAgo {...props} container={Container} tooltip={false}/>
		// }
		// 
		// const Container = ({ verboseDate, children }) => (
		//   <Tooltip text={verboseDate}>
		//     {children}
		//   </Tooltip>
		// )
		// ```
		//
		container : PropTypes.func,

		// CSS `style` object.
		// E.g. `{ color: white }`.
		style : PropTypes.object,

		// CSS class name
		className : PropTypes.string
	}

	static defaultProps =
	{
		locales : [],

		tooltip : true,

		// Thursday, December 20, 2012, 7:00:00 AM GMT+4
		verboseDateFormat:
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

	constructor(props)
	{
		// `this.props` are used in `.getPreferredLocales()`.
		super(props)

		this.timeAgo = new JavascriptTimeAgo(this.getPreferredLocales())
	}

	shouldComponentUpdate(nextProps)
	{
		return !shallowEqual(this.props, nextProps)
	}

	componentDidMount()
	{
		const
		{
			tick,
			updateInterval,
			verboseDateFormat
		}
		= this.props

		// If time label autoupdates are enabled.
		if (tick)
		{
			// Run automatic time label updater (in a web browser).
			if (!window._react_time_ago_updater) {
				window._react_time_ago_updater = new Periodic(updateInterval)
			}

			// Register for the relative time autoupdate as the time goes by.
			this.stop_autoupdate = window._react_time_ago_updater.add(() => this.forceUpdate())
		}

		// Format verbose date for HTML `tooltip` attribute.
		this.format_verbose_date = createVerboseDateFormatter(this.getPreferredLocales(), verboseDateFormat)
		this.forceUpdate()
	}

	componentWillUnmount()
	{
		if (this.stop_autoupdate) {
			this.stop_autoupdate()
		}
	}

	render()
	{
		const
		{
			children,
			timeStyle,
			tooltip,
			container,
			style,
			className
		}
		= this.props

		// The date or timestamp that was passed.
		let date   = (children instanceof Date) && children
		const time = (typeof children === 'number') && children

		// Convert timestamp to `Date`.
		date = date || new Date(time)

		// Only after `componentDidMount()` (only on client side).
		// The rationale is that if javascript is disabled (e.g. Tor Browser)
		// then the `<Tooltip/>` component won't ever be able to show itself.
		const verbose_date = this.format_verbose_date ? this.getVerboseDate(date) : undefined

		const timeAgo =
		(
			<time
				dateTime={ date.toISOString() }
				title={ tooltip ? verbose_date : undefined } 
				style={ container ? undefined : style } 
				className={ container ? undefined : className }>

				{ this.timeAgo.format(date, timeStyle) }
			</time>
		)

		if (container)
		{
			return React.createElement(container,
			{
				verboseDate : verbose_date,
				className,
				style
			},
			timeAgo)
		}

		return timeAgo
	}

	// Composes a list of preferred locales
	getPreferredLocales()
	{
		const { locale } = this.props
		let { locales } = this.props

		// Convert `locale` to `locales`.
		if (locale) {
			locales = [locale].concat(locales)
		}

		// `javascript-time-ago` default locale.
		locales = locales.concat(JavascriptTimeAgo.default_locale)

		return locales
	}

	// Verbose date string.
	// Is used as a tooltip text.
	//
	// E.g. "Sunday, May 18th, 2012, 18:45"
	//
	getVerboseDate(input)
	{
		const { formatVerboseDate } = this.props

		if (formatVerboseDate) {
			return formatVerboseDate(convertToDate(input))
		}

		return this.format_verbose_date(convertToDate(input))
	}
}

// Converts argument into a `Date`.
function convertToDate(input)
{
	if (input.constructor === Date) {
		return input
	}

	if (typeof input === 'number') {
		return new Date(input)
	}

	throw new Error(`Unsupported react-time-ago input: ${typeof input}, ${input}`)
}