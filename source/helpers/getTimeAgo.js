import TimeAgo from 'javascript-time-ago'

import Cache from './cache.js'

const TimeAgoCache = new Cache()
export default function getTimeAgo(preferredLocales, { polyfill }) {
	// `TimeAgo` instance creation is (hypothetically) assumed
	// a lengthy operation so the instances are cached and reused.
	// https://gitlab.com/catamphetamine/react-time-ago/-/issues/1
	const key = String(preferredLocales) + ':' + String(polyfill)
	return TimeAgoCache.get(key) ||
		TimeAgoCache.put(key, new TimeAgo(preferredLocales, { polyfill }))
}