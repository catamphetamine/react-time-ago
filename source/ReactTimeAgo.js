import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import JavascriptTimeAgo from 'javascript-time-ago'
import { style } from 'javascript-time-ago/prop-types'

import createVerboseDateFormatter from './helpers/verboseDateFormatter'
import { getDate, getTime, isMockedDate } from './helpers/date'

// Stupid Rollup doesn't know how to property read "default" export.
import UPDATE_INTERVALS from './updateIntervals'

// `setTimeout()` would enter an infinite cycle when interval is a `MONTH`.
// https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
const SET_TIMEOUT_MAX_DELAY = 2147483647

export default function ReactTimeAgo({
	date,
	timeStyle,
	tooltip,
	// `container` property name is deprecated, 
	// use `wrapperComponent` property name instead.
	container,
	wrapperComponent,
	wrapperProps,
	locale,
	locales,
	formatVerboseDate,
	verboseDateFormat,
	updateInterval,
	tick,
	...rest
}) {
	// Composes a list of preferred locales
	const preferredLocales = useMemo(() => {
		// Convert `locale` to `locales`.
		if (locale) {
			locales = [locale]
		}
		// `javascript-time-ago` default locale.
		return locales.concat(JavascriptTimeAgo.getDefaultLocale())
	}, [
		locale,
		locales
	])

	// Create `javascript-time-ago` formatter instance.
	const timeAgo = useMemo(() => {
		return new JavascriptTimeAgo(preferredLocales)
	}, [
		preferredLocales
	])

	// Create verbose date formatter for the tooltip text.
	// (only on client side, because tooltips aren't rendered until triggered)
	const verboseDateFormatter = useMemo(() => {
		if (typeof window !== 'undefined') {
			return createVerboseDateFormatter(preferredLocales, verboseDateFormat)
		}
	}, [
		preferredLocales,
		verboseDateFormat
	])

	const [unusedState, setUnusedState] = useState()
	const forceUpdate = useCallback(() => setUnusedState({}), [setUnusedState])

	const autoUpdateTimer = useRef()

	const getNextAutoUpdateDelay = useCallback(() => {
		const interval = getUpdateIntervalSetting(updateInterval, timeStyle)
		if (Array.isArray(interval)) {
			return getUpdateIntervalBasedOnTime(interval, date)
		}
		return interval
	}, [
		date, 
		timeStyle, 
		updateInterval
	])

	const scheduleNextTick = useCallback(() => {
		// Register for the relative time autoupdate as the time goes by.
		autoUpdateTimer.current = setTimeout(() => {
			forceUpdate()
			scheduleNextTick()
		}, getNextAutoUpdateDelay())
	}, [
		forceUpdate,
		getNextAutoUpdateDelay
	])

	// Verbose date string.
	// Is used as a tooltip text.
	//
	// E.g. "Sunday, May 18th, 2012, 18:45"
	//
	const getVerboseDate = useCallback((input) => {
		const date = convertToDate(input)
		if (formatVerboseDate) {
			return formatVerboseDate(date)
		}
		return verboseDateFormatter(date)
	}, [
		formatVerboseDate,
		verboseDateFormatter
	])

	useEffect(() => {
		// If time label autoupdates are enabled.
		if (tick) {
			scheduleNextTick()
		}
		return () => {
			clearTimeout(autoUpdateTimer.current)
		}
	}, [])

	// The date or timestamp that was passed.
	// Convert timestamp to `Date`.
	date = getDate(date)

	// Format verbose date for the tooltip.
	// (only on client side, because tooltips aren't rendered until triggered)
	const verboseDate = typeof window === 'undefined' ? undefined : getVerboseDate(date)

	const timeElement = (
		<time
			dateTime={date.toISOString()}
			title={tooltip ? verboseDate : undefined} 
			{...rest}>
			{timeAgo.format(date, timeStyle)}
		</time>
	)

	if (wrapperComponent || container) {
		return React.createElement(
			wrapperComponent || container,
			{
				verboseDate,
				...wrapperProps
			},
			timeElement
		)
	}

	return timeElement
}

ReactTimeAgo.propTypes = {
	// The `date` or `timestamp`.
	// E.g. `new Date()` or `1355972400000`.
	date: PropTypes.oneOfType([
		PropTypes.instanceOf(Date),
		PropTypes.number
	]).isRequired,

	// Preferred locale.
	// Is 'en' by default.
	// E.g. 'ru-RU'.
	locale: PropTypes.string,

	// Preferred locales (ordered).
	// Will choose the first suitable locale from this list.
	// (the one that has been initialized)
	// E.g. `['ru-RU', 'en-GB']`.
	locales: PropTypes.arrayOf(PropTypes.string),

	// Date/time formatting style.
	// E.g. 'round', 'round-minute', 'twitter', 'approximate', 'time', or custom (`{ gradation: […], units: […], flavour: 'long', custom: function }`)
	timeStyle: style,

	// Whether HTML `tooltip` attribute should be set
	// to verbosely formatted date (is `true` by default).
	// Set to `false` to disable the native HTML `tooltip`.
	tooltip: PropTypes.bool.isRequired,

	// An optional function returning what will be output in the HTML `title` tooltip attribute.
	// (by default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`)
	formatVerboseDate: PropTypes.func,

	// `Intl.DateTimeFormat` format for the HTML `title` tooltip attribute.
	// Is used when `formatVerboseDate` is not specified.
	// By default outputs a verbose date.
	verboseDateFormat: PropTypes.object,

	// How often to update all `<ReactTimeAgo/>` elements on a page.
	// (is once in a minute by default)
	// This setting is only used for "custom" `timeStyle`s.
	// For standard `timeStyle`s, "smart" autoupdate interval is used:
	// every minute for the first hour, then every 10 minutes for the first 12 hours, and so on.
	updateInterval: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.arrayOf(PropTypes.shape({
			threshold: PropTypes.number,
			interval: PropTypes.number.isRequired
		}))
	]),

	// Set to `false` to disable automatic refresh of
	// `<ReactTimeAgo/>` elements on a page as time goes by.
	// (is `true` by default)
	tick: PropTypes.bool,

	// React Component to wrap the resulting `<time/>` React Element.
	// Receives `verboseDate` and `children` properties.
	// Also receives `wrapperProps`, if they're passed.
	// `verboseDate` can be used for displaying verbose date label
	// in an "on mouse over" (or "on touch") tooltip.
	//
	// ```js
	// import React from 'react'
	// import ReactTimeAgo from 'react-time-ago'
	// import { Tooltip } from 'react-responsive-ui'
	// 
	// export default function TimeAgo(props) {
	//   return (
	//     <ReactTimeAgo 
	//       {...props} 
	//       wrapperComponent={Wrapper} 
	//       tooltip={false}/>
	//   )
	// }
	// 
	// const Wrapper = ({ verboseDate, children, ...rest }) => (
	//   <Tooltip {...rest} content={verboseDate}>
	//     {children}
	//   </Tooltip>
	// )
	// ```
	//
	wrapperComponent: PropTypes.func,

	// Custom `props` passed to `wrapperComponent`.
	wrapperProps: PropTypes.object
}

ReactTimeAgo.defaultProps = {
	// No preferred locales.
	locales: [],

	// Show verbose date `title` tooltip on mouse over.
	tooltip: true,

	// Thursday, December 20, 2012, 7:00:00 AM GMT+4
	verboseDateFormat: {
		weekday      : 'long',
		day          : 'numeric',
		month        : 'long',
		year         : 'numeric',
		hour         : 'numeric',
		minute       : '2-digit',
		second       : '2-digit',
		// timeZoneName : 'short'
	},

	// // Updates once a minute
	// updateInterval: MINUTE,

	// Refreshes time in a web browser by default
	tick: true
}

// Converts argument into a `Date`.
function convertToDate(input) {
	if (input.constructor === Date || isMockedDate(input)) {
		return input
	}
	if (typeof input === 'number') {
		return new Date(input)
	}
	throw new Error(`Unsupported react-time-ago input: ${typeof input}, ${input}`)
}

function getUpdateIntervalSetting(updateInterval, timeStyle) {
	if (updateInterval === undefined) {
		// "Smart" autoupdate intervals are only used for standard time styles.
		if (typeof timeStyle === 'object') {
			return MINUTE
		}
		return UPDATE_INTERVALS
	}
	return updateInterval
}

function getUpdateIntervalBasedOnTime(intervals, date) {
	const time = getTime(date)
	const now = Date.now()
	const diff = Math.abs(now - time)
	let _interval
	for (const { interval, threshold } of intervals) {
		if (threshold && diff < threshold) {
			continue
		}
		_interval = interval
	}
	return Math.min(_interval, SET_TIMEOUT_MAX_DELAY)
}