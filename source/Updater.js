// Manages the updates of all `<ReactTimeAgo/>` elements on a page.
export default {
	listeners: [],

	add(listener) {
		const wasIdle = this.listeners.length === 0
		add(this.listeners, listener)
		if (wasIdle) {
			this.start()
		} else {
			this.scheduleNextTick()
		}

		return {
			stop: () => {
				remove(this.listeners, listener)
				if (this.listeners.length === 0) {
					this.stop()
				} else {
					this.scheduleNextTick()
				}
			},
			forceUpdate: () => {
				triggerListener(listener)
			}
		}
	},

	tick() {
		// This line isn't required but I personally clear timer IDs when they're triggered.
		this.scheduledTick = undefined

		// Trigger every listener that should be triggered.
		const now = Date.now()
		for (const listener of this.listeners) {
			if (now >= listener.updateTime) {
				triggerListener(listener)
			}
		}
	},

	scheduleNextTick() {
		this.cancelNextTick()

		if (this.listeners.length === 0) {
			return
		}

		let earliestUpdateTime = this.listeners[0].updateTime
		let i = 1
		while (i < this.listeners.length) {
			if (this.listeners[i].updateTime < earliestUpdateTime) {
				earliestUpdateTime = this.listeners[i].updateTime
			}
			i++
		}
		this.scheduledTick = setTimeout(() => {
			this.tick()
			this.scheduleNextTick()
		}, earliestUpdateTime - Date.now())
	},

	cancelNextTick() {
		clearTimeout(this.scheduledTick)
		// This line isn't required but I personally clear timer IDs when they're triggered.
		this.scheduledTick = undefined
	},

	start() {
		this.scheduleNextTick()
	},

	stop() {
		this.cancelNextTick()
	}
}

function triggerListener(listener) {
	const [value, updateTime] = listener.getNewValueAndNextUpdateTime()
	listener.setValue(value)
	listener.updateTime = updateTime
}

// Adds a listener.
function add(listeners, listener) {
	listeners.push(listener)
}

// Removes a listener.
function remove(listeners, listener) {
	const i = findIndex(listeners, listener)
	listeners.splice(i, 1)
}

// Finds an index of `listener` in `listeners` array.
function findIndex(listeners, listener) {
	return listeners.indexOf(listener)
}