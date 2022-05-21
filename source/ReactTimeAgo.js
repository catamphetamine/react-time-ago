import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import TimeAgo from 'javascript-time-ago'

import getVerboseDateFormatter from './helpers/getVerboseDateFormatter.js'
import { getDate } from './helpers/date.js'
import getTimeAgo from './helpers/getTimeAgo.js'

import Updater from './Updater.js'
import Time from './Time.js'

import { style as styleType } from './PropTypes.js'

function ReactTimeAgo({
	date,
	future,
	timeStyle,
	round,
	minTimeLeft,
	tooltip,
	component: Component,
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
	now: nowProperty,
	timeOffset,
	polyfill,
	...rest
}) {
	// Get the list of preferred locales.
	const preferredLocales = useMemo(() => {
		// Convert `locale` to `locales`.
		if (locale) {
			locales = [locale]
		}
		// Add `javascript-time-ago` default locale.
		return locales.concat(TimeAgo.getDefaultLocale())
	}, [
		locale,
		locales
	])

	// Create `javascript-time-ago` formatter instance.
	const timeAgo = useMemo(() => {
		return getTimeAgo(preferredLocales, { polyfill })
	}, [
		preferredLocales,
		polyfill
	])

	// The date or timestamp that was passed.
	// Convert timestamp to `Date`.
	date = useMemo(() => getDate(date), [date])

	// Formats the `date`.
	const formatDate = useCallback(() => {
		let now = (nowProperty || Date.now()) - timeOffset
		let stopUpdates
		if (future) {
			if (now >= date.getTime()) {
				now = date.getTime()
				stopUpdates = true
			}
		}
		if (minTimeLeft !== undefined) {
			const maxNow = date.getTime() - minTimeLeft * 1000
			if (now > maxNow) {
				now = maxNow
				stopUpdates = true
			}
		}
		let [formattedDate, timeToNextUpdate] = timeAgo.format(date, timeStyle, {
			getTimeToNextUpdate: true,
			now,
			future,
			round
		})
		if (stopUpdates) {
			timeToNextUpdate = INFINITY
		} else {
			// Legacy compatibility: there used to be an `updateInterval` property.
			// That was before `getTimeToNextUpdate` feature was introduced in `javascript-time-ago`.
			// A default interval of one minute is introduced because
			// `getTimeToNextUpdate` feature may theoretically return `undefined`.
			timeToNextUpdate = updateInterval || timeToNextUpdate || 60 * 1000 // A minute by default.
		}
		return [formattedDate, now + timeToNextUpdate]
	}, [
		date,
		future,
		timeStyle,
		updateInterval,
		round,
		minTimeLeft,
		timeAgo,
		nowProperty
	])

	const formatDateRef = useRef()
	formatDateRef.current = formatDate

	const [_formattedDate, _nextUpdateTime] = useMemo(formatDate, [])
	const [formattedDate, setFormattedDate] = useState(_formattedDate)

	const updater = useRef()

	useEffect(() => {
		if (tick) {
			updater.current = Updater.add({
				getNextValue: () => formatDateRef.current(),
				setValue: setFormattedDate,
				nextUpdateTime: _nextUpdateTime
			})
			return () => updater.current.stop()
		}
	}, [tick])

	useEffect(() => {
		if (updater.current) {
			updater.current.forceUpdate()
		} else {
			const [formattedDate] = formatDate()
			setFormattedDate(formattedDate)
		}
	}, [formatDate])

	// Create verbose date formatter for the tooltip text.
	const verboseDateFormatter = useMemo(() => {
		return getVerboseDateFormatter(
			preferredLocales, 
			verboseDateFormat
		)
	}, [
		preferredLocales,
		verboseDateFormat
	])

	// Format verbose date for the tooltip.
	const verboseDate = useMemo(() => {
		if (formatVerboseDate) {
			return formatVerboseDate(date)
		}
		return verboseDateFormatter(date)
	}, [
		date,
		formatVerboseDate,
		verboseDateFormatter
	])

	const result = (
		<Component
			date={date}
			verboseDate={verboseDate}
			tooltip={tooltip}
			{...rest}>
			{formattedDate}
		</Component>
	)

	const WrapperComponent = wrapperComponent || container

	if (WrapperComponent) {
		return (
			<WrapperComponent
				{...wrapperProps}
				verboseDate={verboseDate}>
				{result}
			</WrapperComponent>
		)
	}

	return result
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

	// Alternatively to `locale`, one could pass `locales`:
	// A list of preferred locales (ordered).
	// Will choose the first supported locale from the list.
	// E.g. `['ru-RU', 'en-GB']`.
	locales: PropTypes.arrayOf(PropTypes.string),

	// If set to `true`, then will stop at "zero point"
	// when going from future dates to past dates.
	// In other words, even if the `date` has passed,
	// it will still render as if `date` is `now`.
	future: PropTypes.bool,

	// Date/time formatting style.
	// See `javascript-time-ago` docs on "Styles" for more info.
	// E.g. 'round', 'round-minute', 'twitter', 'twitter-first-minute'.
	timeStyle: styleType,

	// `round` parameter of `javascript-time-ago`.
	// See `javascript-time-ago` docs on "Rounding" for more info.
	// Examples: "round", "floor".
	round: PropTypes.string,

	// If specified, the time won't "tick" past this threshold (in seconds).
	// For example, if `minTimeLeft` is `60 * 60`
	// then the time won't "tick" past "in 1 hour".
	minTimeLeft: PropTypes.number,

	// A React component to render the relative time label.
	// Receives properties:
	// * date: Date — The date.
	// * verboseDate: string — Formatted verbose date.
	// * tooltip: boolean — The `tooltip` property of `<ReactTimeAgo/>` component.
	// * children: string — The relative time label.
	// * All "unknown" properties that have been passed to `<ReactTimeAgo/>` are passed through to this component.
	component: PropTypes.elementType.isRequired,

	// Whether to use HTML `tooltip` attribute to show a verbose date tooltip.
	// Is `true` by default.
	// Can be set to `false` to disable the native HTML `tooltip`.
	tooltip: PropTypes.bool.isRequired,

	// Verbose date formatter.
	// By default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`.
	formatVerboseDate: PropTypes.func,

	// `Intl.DateTimeFormat` format for formatting verbose date.
	// See `Intl.DateTimeFormat` docs for more info.
	verboseDateFormat: PropTypes.object,

	// (deprecated)
	// How often the component refreshes itself.
	// Instead, consider using `getNextTimeToUpdate()` feature
	// of `javascript-time-ago` styles.
	updateInterval: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.arrayOf(PropTypes.shape({
			threshold: PropTypes.number,
			interval: PropTypes.number.isRequired
		}))
	]),

	// (deprecated).
	// Set to `false` to disable automatic refresh of the component.
	// Is `true` by default.
	// I guess no one actually turns that off.
	tick: PropTypes.bool,

	// Allows setting a custom baseline for relative time measurement.
	// https://gitlab.com/catamphetamine/react-time-ago/-/issues/4
	now: PropTypes.number,

	// Allows offsetting the `date` by an arbitrary amount of milliseconds.
	// https://gitlab.com/catamphetamine/react-time-ago/-/issues/4
	timeOffset: PropTypes.number,

	// Pass `false` to use native `Intl.RelativeTimeFormat` / `Intl.PluralRules`
	// instead of the polyfilled ones in `javascript-time-ago`.
	polyfill: PropTypes.bool,

	// (advanced)
	// A React Component to wrap the resulting `<time/>` React Element.
	// Receives `verboseDate` and `children` properties.
	// Also receives `wrapperProps`, if they're passed.
	// `verboseDate` can be used for displaying verbose date label
	// in an "on mouse over" (or "on touch") tooltip.
	// See the "Tooltip" readme section for more info.
	// Another example could be having `wrapperComponent`
	// being rerendered every time the component refreshes itself.
	wrapperComponent: PropTypes.elementType,

	// Custom `props` passed to `wrapperComponent`.
	wrapperProps: PropTypes.object
}

ReactTimeAgo.defaultProps = {
	// No preferred locales.
	locales: [],

	// Use a `<time/>` tag by default.
	component: Time,

	// Use HTML `tooltip` attribute to show a verbose date tooltip.
	tooltip: true,

	// `Intl.DateTimeFormat` for verbose date.
	// Example: "Thursday, December 20, 2012, 7:00:00 AM GMT+4"
	verboseDateFormat: {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		// timeZoneName: 'short'
	},

	// Automatically refreshes itself.
	tick: true,

	// No time offset.
	timeOffset: 0
}

// The component schedules a next refresh every time it renders.
// There's no need to rerender this component unless its props change.
ReactTimeAgo = React.memo(ReactTimeAgo)

export default ReactTimeAgo

// A thousand years is practically a metaphor for "infinity"
// in the context of this component.
const YEAR = 365 * 24 * 60 * 60 * 1000
const INFINITY = 1000 * YEAR