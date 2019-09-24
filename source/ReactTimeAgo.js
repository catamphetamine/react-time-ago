import React from 'react'
import PropTypes from 'prop-types'
import JavascriptTimeAgo from 'javascript-time-ago'
import { style } from 'javascript-time-ago/prop-types'

import Periodic from './Periodic'
import createVerboseDateFormatter from './verboseDateFormatter'
import { getDate, isMockedDate } from './helpers/date'

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class ReactTimeAgo extends PureComponent
{
	static propTypes =
	{
		// The `date` or `timestamp`.
		// E.g. `new Date()` or `1355972400000`.
		date : PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.number
		]).isRequired,

		// Preferred locale.
		// Is 'en' by default.
		// E.g. 'ru-RU'.
		locale : PropTypes.string,

		// Preferred locales (ordered).
		// Will choose the first suitable locale from this list.
		// (the one that has been initialized)
		// E.g. `['ru-RU', 'en-GB']`.
		locales : PropTypes.arrayOf(PropTypes.string),

		// Date/time formatting style.
		// E.g. 'twitter', 'time', or custom (`{ gradation: […], units: […], flavour: 'long', custom: function }`)
		timeStyle : style,

		// Whether HTML `tooltip` attribute should be set
		// to verbosely formatted date (is `true` by default).
		// Set to `false` to disable the native HTML `tooltip`.
		tooltip : PropTypes.bool.isRequired,

		// An optional function returning what will be output in the HTML `title` tooltip attribute.
		// (by default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`)
		formatVerboseDate : PropTypes.func,

		// `Intl.DateTimeFormat` format for the HTML `title` tooltip attribute.
		// Is used when `formatVerboseDate` is not specified.
		// By default outputs a verbose date.
		verboseDateFormat : PropTypes.object,

		// How often to update all `<ReactTimeAgo/>` elements on a page.
		// (is once in a minute by default)
		updateInterval : PropTypes.number,

		// Set to `false` to disable automatic refresh of
		// `<ReactTimeAgo/>` elements on a page as time goes by.
		// (is `true` by default)
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
		//   <Tooltip content={verboseDate}>
		//     {children}
		//   </Tooltip>
		// )
		// ```
		//
		container : PropTypes.func
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

		// Create `javascript-time-ago` formatter instance.
		this.timeAgo = new JavascriptTimeAgo(this.getPreferredLocales())

		// Create verbose date formatter for the tooltip text.
		// (only on client side, because tooltips aren't rendered until triggered)
		if (typeof window !== 'undefined') {
			const { verboseDateFormat } = this.props
			this.formatVerboseDate = createVerboseDateFormatter(this.getPreferredLocales(), verboseDateFormat)
		}
	}

	componentDidMount()
	{
		const
		{
			tick,
			updateInterval
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
			this.stopAutoupdate = window._react_time_ago_updater.add(() => this.forceUpdate())
		}
	}

	componentWillUnmount()
	{
		if (this.stopAutoupdate) {
			this.stopAutoupdate()
		}
	}

	render() {
		const {
			date: _date,
			timeStyle,
			tooltip,
			container,
			// Rest
			locale,
			locales,
			formatVerboseDate,
			verboseDateFormat,
			updateInterval,
			tick,
			...rest
		} = this.props

		// The date or timestamp that was passed.
		// Convert timestamp to `Date`.
		const date = getDate(_date)

		// Format verbose date for the tooltip.
		// (only on client side, because tooltips aren't rendered until triggered)
		const verboseDate = typeof window === 'undefined' ? undefined : this.getVerboseDate(date)

		const timeAgo = (
			<time
				dateTime={date.toISOString()}
				title={tooltip ? verboseDate : undefined} 
				{...rest}>
				{this.timeAgo.format(date, timeStyle)}
			</time>
		)

		if (container) {
			return React.createElement(
				container,
				{
					verboseDate,
					...rest
				},
				timeAgo
			)
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
			locales = [locale]
		}

		// `javascript-time-ago` default locale.
		locales = locales.concat(JavascriptTimeAgo.getDefaultLocale())

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

		return this.formatVerboseDate(convertToDate(input))
	}
}

// Converts argument into a `Date`.
function convertToDate(input)
{
	if (input.constructor === Date || isMockedDate(input))
		return input
	}

	if (typeof input === 'number') {
		return new Date(input)
	}

	throw new Error(`Unsupported react-time-ago input: ${typeof input}, ${input}`)
}