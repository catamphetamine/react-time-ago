// Manages the updates of all `<ReactTimeAgo/>` elements on a page.

// The reasons for going with `requestAnimationFrame()`:
// * `requestAnimationFrame` won't be called when a tab is in background.
// * Chrome has bugs when handling `setTimeout()`: https://www.npmjs.com/package/request-animation-frame-timeout

// `requestAnimationFrame()` polyfill for old browsers.
import requestAnimationFrame from 'raf'

import binarySearch from './helpers/binarySearch'

export default {
	instances: [],
	add(instance) {
		const wasIdle = this.instances.length === 0
		add(this.instances, instance)
		if (wasIdle) {
			this.start()
		}
		return {
			stop: () => {
				remove(this.instances, instance)
				if (this.instances.length === 0) {
					this.stop()
				}
			},
			forceUpdate: () => {
				updateInstance(instance, this.instances)
			}
		}
	},
	tick() {
		const now = Date.now()
		while (true) {
			const instance = this.instances[0]
			if (now >= instance.nextUpdateTime) {
				updateInstance(instance, this.instances)
			} else {
				break
			}
		}
	},
	scheduleNextTick() {
		this.scheduledTick = requestAnimationFrame(() => {
			this.tick()
			this.scheduleNextTick()
		})
	},
	start() {
		this.scheduleNextTick()
	},
	stop() {
		requestAnimationFrame.cancel(this.scheduledTick)
	}
}

function _updateInstance(instance) {
	const [value, nextUpdateTime] = instance.getNextValue()
	instance.setValue(value)
	instance.nextUpdateTime = nextUpdateTime
}

function updateInstance(instance, instances) {
	_updateInstance(instance)
	remove(instances, instance)
	add(instances, instance)
}

function add(instances, instance) {
	const i = findTargetIndex(instances, instance)
	instances.splice(i, 0, instance)
}

function remove(instances, instance) {
	const i = instances.indexOf(instance)
	instances.splice(i, 1)	
}

function findTargetIndex(instances, instance) {
	const { nextUpdateTime } = instance
	return binarySearch(instances, (instance) => {
		if (instance.nextUpdateTime === nextUpdateTime) {
			return 0
		} else if (instance.nextUpdateTime > nextUpdateTime) {
			return 1
		} else {
			return -1
		}
	})
}