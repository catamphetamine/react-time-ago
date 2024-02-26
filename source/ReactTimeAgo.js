import React from 'react'
import PropTypes from 'prop-types'

import Time from './Time.js'
import useTimeAgo from './useTimeAgo.js'

import { style as styleType } from './PropTypes.js'

function ReactTimeAgo({
	date: dateProperty,
	future,
	timeStyle,
	round,
	minTimeLeft,
	locale,
	locales = [],
	formatVerboseDate,
	// `Intl.DateTimeFormat` for verbose date.
	verboseDateFormat,
	updateInterval,
	tick,
	now: nowProperty,
	timeOffset,
	polyfill,

	// React Component properties:
	// Use HTML `tooltip` attribute to show a verbose date tooltip.
	tooltip = true,
	// Use `<time/>` tag by default.
	component: Component = Time,
	// `container` property name is deprecated, 
	// use `wrapperComponent` property name instead.
	container,
	wrapperComponent,
	wrapperProps,
	...rest
}) {
	const {
		date,
		verboseDate,
		formattedDate
	} = useTimeAgo({
		date: dateProperty,
		future,
		timeStyle,
		round,
		minTimeLeft,
		locale,
		locales,
		formatVerboseDate,
		verboseDateFormat,
		updateInterval,
		tick,
		now: nowProperty,
		timeOffset,
		polyfill
	});

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
	// `date: Date` or `timestamp: number`.
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
	component: PropTypes.elementType,

	// Whether to use HTML `tooltip` attribute to show a verbose date tooltip.
	// Is `true` by default.
	// Can be set to `false` to disable the native HTML `tooltip`.
	tooltip: PropTypes.bool,

	// Verbose date formatter.
	// By default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`.
	formatVerboseDate: PropTypes.func,

	// `Intl.DateTimeFormat` format for formatting verbose date.
	// See `Intl.DateTimeFormat` docs for more info.
	verboseDateFormat: PropTypes.object,

	// (deprecated)
	// How often the component refreshes itself.
	// When not provided, will use `getNextTimeToUpdate()` feature
	// of `javascript-time-ago` styles to determine the update interval.
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
	// I guess no one actually turns auto-update off, so this parameter is deprecated.
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

// The component schedules a next refresh every time it renders.
// There's no need to rerender this component unless its props change.
ReactTimeAgo = React.memo(ReactTimeAgo)

export default ReactTimeAgo