let instantNavigationChain = []
let instantNavigationChainIndex = -1

/**
 * Is called when a `<Link/>` with `instantBack` property set is clicked.
 *
 * Stores "current" (soon to be "previous") location in "instant back chain",
 * so that if "Back" is clicked later then the transition to this
 * "current" (soon to be "previous") location is marked as "should be instant".
 *
 * "Instant back chain" consists of locations stored as a consequitive chain
 * and theoretically there can be more than one consequtive "instant back"-able
 * navigation in it (e.g. page1 -> page2 -> page3 -> "Back" -> page2 -> "Back" -> page3)
 * though I wouldn't advice doing that and would keep it minimal (a chain of two locations).
 *
 * Once a regular navigation is performed (i.e. not "instant one")
 * then the whole "instant back chain" is discarded.
 * E.g. a user clicks on `<Link instantBack/>` and is taken to a page
 * where he clicks on another `<Link/>` now without `instantBack` -
 * in this case all "instant back" history is discarded
 * and if the user clicks "Back" two times the second time won't be "instant".
 */
export function addInstantBack(
	nextLocation,
	previousLocation,
	nextLocationRouteComponents,
	previousLocationRouteComponents
)
{
	let chain = instantNavigationChain

	// If there is already an "instant" transition in the chain
	// then insert this transition into the chain
	// only if it's "page1 -> page2" and "page2 -> page3"
	// so that the chain becomes "page1 -> page2 -> page3".
	// Otherwise, the already existing "instant back" chain is reset.
	if (chain.length > 0)
	{
		const previousLocationIndex = indexOfByKey(chain, getLocationKey(previousLocation))

		if (previousLocationIndex >= 0)
		{
			// If transitioning from "page2" to "page3"
			// and the existing chain is "page1 -> page2 -> page4"
			// then trim the chain up to the "current" page
			// so that it becomes "page1 -> page2" (eligible for merging).
			chain = chain.slice(0, previousLocationIndex + 1)
		}
		else
		{
			// console.error('[react-pages] Error: previous location not found in an already existing instant back navigation chain', getLocationKey(previousLocation), chain)
			// Anomaly detected.
			// Reset the chain.
			// return resetInstantNavigationChain()

			// Basic recovery for cases where `history.replaceState()`
			// or `replaceHistory()` were called.
			// (e.g. Algolia "Instant Search" widget filters reconfigured)
			chain = []
		}
	}

	if (chain.length === 0)
	{
		// Add the "current" page to the chain.
		chain =
		[{
			key : getLocationKey(previousLocation),
			routes : previousLocationRouteComponents
		}]
	}

	// Discard "instant back" chain part having same routes.
	const sameRoutesIndex = findSameRoutesLocationIndex(chain, nextLocationRouteComponents)
	if (sameRoutesIndex >= 0) {
		chain = chain.slice(sameRoutesIndex + 1)
	}

	// Add the "next" page to the chain.
	chain.push({
		key : getLocationKey(nextLocation),
		routes : nextLocationRouteComponents
	})

	// Save the chain.
	instantNavigationChain = chain
	instantNavigationChainIndex = chain.length - 1
}

/**
 * Checks if a "Back"/"Forward" transition should be "instant".
 * For "Back" transition it would mean that
 * the `<Link/>` has `instantBack` property set.
 * For "Forward" transition it would mean that
 * it's a reverse of an instant "Back" transition.
 * The order and position inside `chain` don't matter.
 */
export function isInstantTransition(fromLocation, toLocation)
{
	return indexOfByKey(instantNavigationChain, getLocationKey(fromLocation)) >= 0 &&
		indexOfByKey(instantNavigationChain, getLocationKey(toLocation)) >= 0
}

/**
 * Clears any "instant back" history.
 */
export function resetInstantNavigationChain() {
	instantNavigationChain = []
	instantNavigationChainIndex = -1
}

/**
 * Updates instant navigation chain's current route index.
 */
export function updateInstantNavigationChainIndex(location) {
	let i = 0
	while (i < instantNavigationChain.length) {
		if (instantNavigationChain[i].key === getLocationKey(location)) {
			instantNavigationChainIndex = i
			return
		}
		i++
	}
	// Shouldn't happen.
	console.error('[react-pages] Location not found in instant navigation chain', location)
	instantNavigationChainIndex = -1
}

/**
 * Each history `location` has a randomly generated `key`.
 */
const getLocationKey = location => location.key

function indexOfByKey(chain, key) {
	let i = 0
	while (i < chain.length) {
		if (chain[i].key === key) {
			return i
		}
		i++
	}
	return -1
}

function findSameRoutesLocationIndex(chain, routes) {
	let i = 0
	while (i < chain.length) {
		if (chain[i].routes.length === routes.length) {
			let j = 0
			while (j < routes.length) {
				if (chain[i].routes[j] !== routes[j]) {
					break
				}
				j++
			}
			if (j === routes.length) {
				return i
			}
		}
		i++
	}
	return -1
}

// Can be used to find out if the current page
// transition was an "instant" one.
// E.g. an Algolia "Instant Search" component
// could reset the stored cached `resultsState`
// if the transition was not an "instant" one.
export function wasInstantNavigation() {
	return typeof window !== 'undefined' && window._react_pages_was_instant_navigation === true
}

export function isInstantBackAbleNavigation() {
	return typeof window !== 'undefined' && window._react_pages_is_instant_back_able_navigation
}

export function setInstantNavigationFlag(value) {
	if (typeof window !== 'undefined') {
		window._react_pages_was_instant_navigation = value
	}
}

/**
 * This function is also called with `false`
 * in order to set the flag to `false`.
 * Theoretically that might make sense in case of
 * two immediately consequtive `goto()` calls or something.
 * Though it's not a sane use case and may be considered invalid.
 * @param  {boolean} [instantBack]
 * @return
 */
export function markImmediateNavigationAsInstantBack(instantBack) {
	// Is being read in `./redux/middleware/router.js`
	window._react_pages_instant_back_navigation = instantBack
	if (instantBack) {
		// Resetting the flag immediately after it's processed in router's POP event listener.
		// Could reset it there too.
		// Not resetting on some "on navigation finished" event because
		// `load` could throw and the navigation wouldn't conclude in that case.
		setTimeout(() => window._react_pages_instant_back_navigation = false, 0)
	}
}

export function canGoBackInstantly() {
	return instantNavigationChainIndex > 0
}

export function canGoForwardInstantly() {
	return instantNavigationChainIndex < instantNavigationChain.length - 1
}