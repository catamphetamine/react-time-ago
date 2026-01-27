import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import TimeAgo from 'javascript-time-ago'

import getVerboseDateFormatter from './helpers/getVerboseDateFormatter.js'
import { getDate } from './helpers/date.js'
import getTimeAgo from './helpers/getTimeAgo.js'

import Updater from './Updater.js'

export default function useTimeAgo({
	// `date: Date` or `timestamp: number`.
	// E.g. `new Date()` or `1355972400000`.
	date,

	// When `future` is set to `true` and `date` is equal to `Date.now()`,
	// it will format it as "in 0 seconds" rather than "0 seconds ago".
	future,

	// Preferred locale.
	// Is 'en' by default.
	// E.g. 'ru-RU'.
	locale,

	// Alternatively to `locale`, one could pass `locales`:
	// A list of preferred locales (ordered).
	// Will choose the first supported locale from the list.
	// E.g. `['ru-RU', 'en-GB']`.
	locales,

	// Date/time formatting style.
	// See `javascript-time-ago` docs on "Styles" for more info.
	// E.g. 'round', 'round-minute', 'twitter', 'twitter-first-minute'.
	timeStyle,

	// `round` parameter of `javascript-time-ago`.
	// See `javascript-time-ago` docs on "Rounding" for more info.
	// Examples: "round", "floor".
	round,

	// When `freezeAt` timestamp is specified, the label will stop refreshing
	// itself when `Date.now()` becomes equal to `freezeAt`.
	// For example, if `freezeAt = Date.now() + 60 * 1000` is passed,
	// the label will refresh itself for 1 minute, after which it will freeze
	// and stop refreshing itself.
	freezeAt,

	// Verbose date formatter.
	// By default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`.
	formatVerboseDate,

	// `Intl.DateTimeFormat` format for formatting verbose date.
	// See `Intl.DateTimeFormat` docs for more info.
	verboseDateFormat,

	// (deprecated)
	// How often the component refreshes itself.
	// When not provided, will use `getNextTimeToUpdate()` feature
	// of `javascript-time-ago` styles to determine the update interval.
	updateInterval,

	// Set to `false` to disable automatic refresh of the component.
	// Is `true` by default.
	// I guess no one actually turns auto-update off, so this parameter is deprecated.
	tick = true,

	// "Now" timestamp.
	// E.g. `Date.now()`.
	now: nowProperty,

	// Allows offsetting the `date` by an arbitrary amount of milliseconds.
	// https://gitlab.com/catamphetamine/react-time-ago/-/issues/4
	timeOffset = 0,

	// Pass `false` to use native `Intl.RelativeTimeFormat` / `Intl.PluralRules`
	// instead of the polyfilled ones in `javascript-time-ago`.
	// The default value is `true` meaning that it uses polyfills for
	// `Intl.RelativeTimeFormat` / `Intl.PluralRules` (polyfills are from `javascript-time-ago`).
	polyfill
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
		let stopRefreshing = false
		if (freezeAt !== undefined) {
			if (now > freezeAt) {
				now = freezeAt
				stopRefreshing = true
			}
		}
		let [formattedDate, timeToNextUpdate] = timeAgo.format(date, timeStyle, {
			getTimeToNextUpdate: true,
			now,
			future,
			round
		})
		if (stopRefreshing) {
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
		freezeAt,
		timeAgo,
		nowProperty
	])

	const formatDateRef = useRef()
	formatDateRef.current = formatDate

	const [_formattedDate, _nextUpdateTime] = useMemo(formatDate, [])
	const [formattedDate, setFormattedDate] = useState(_formattedDate)

	const textUpdater = useRef()

	useEffect(() => {
		if (tick) {
			textUpdater.current = Updater.add({
				getNewValueAndNextUpdateTime: () => formatDateRef.current(),
				setValue: setFormattedDate,
				updateTime: _nextUpdateTime
			})
			return () => {
				textUpdater.current.stop()
			}
		}
	}, [tick])

	useEffect(() => {
		if (textUpdater.current) {
			textUpdater.current.forceUpdate()
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

	return {
		date,
		formattedDate,
		verboseDate
	};
}

// A thousand years is practically a metaphor for "infinity"
// in the context of this component.
const YEAR = 365 * 24 * 60 * 60 * 1000
const INFINITY = 1000 * YEAR