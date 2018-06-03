/**
 * Calls all subscribers once in a period.
 */
export default class Periodic
{
	// subscribers = new Set()
	subscribers = []

	/**
	 * @param {number} period - The interval (in milliseconds).
	 */
	constructor(period)
	{
		this.period = period
	}

	start()
	{
		// Do nothing if already started.
		if (this.scheduled) {
			return
		}

		// Start
		this.schedule()
	}

	schedule()
	{
		this.scheduled = setTimeout(this.trigger, this.period)
	}

	trigger = (dry_run) =>
	{
		// Call all subscribers.
		for (const subscriber of this.subscribers) {
			subscriber()
		}

		// Schedule next iteration.
		this.schedule()
	}

	stop()
	{
		clearTimeout(this.scheduled)
		this.scheduled = undefined
	}

	add(subscriber)
	{
		// Add subscriber.
		// this.subscribers.add(subscriber)
		if (this.subscribers.indexOf(subscriber) < 0) {
			this.subscribers.push(subscriber)
		}

		// If it's the first subscriber,
		// start this periodical.
		// if (this.subscribers.size === 1) {
		if (this.subscribers.length === 1) {
			this.start()
		}

		// Return unsubscribe function.
		return () => this.remove(subscriber)
	}

	remove(subscriber)
	{
		// Remove subscriber.
		// this.subscribers.delete(subscriber)
		if (this.subscribers.indexOf(subscriber) >= 0) {
			this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
		}

		// If it was the last subscriber,
		// stop periodical time refresh.
		// if (this.subscribers.size === 0) {
		if (this.subscribers.length === 0) {
			this.stop()
		}
	}

	destroy()
	{
		this.stop()
		// this.subscribers.clear()
		this.subscribers = []
	}
}