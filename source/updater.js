const global_scope = typeof window !== 'undefined' ? window : global

export function get_time_updater()
{
	return global_scope._react_time_ago
}

function set_time_updater(instance)
{
	global_scope._react_time_ago = instance
}

export function start_time_updater(interval)
{
	set_time_updater
	({
		interval,
		updaters : new Set(),
		add(update)
		{
			this.updaters.add(update)

			// If it's the first relative time component,
			// start periodical time refresh.
			if (this.updaters.size === 1)
			{
				start_relative_times_updater()
			}

			return () => this.remove(update)
		},
		remove(update)
		{
			this.updaters.delete(update)

			// If it was the last relative time component,
			// stop periodical time refresh.
			if (this.updaters.size === 0)
			{
				stop_relative_times_updater()
			}
		},
		destroy()
		{
			this.updaters.clear()
			stop_relative_times_updater()

			set_time_updater(undefined)
		}
	})
}

function start_relative_times_updater()
{
	if (get_time_updater().timer)
	{
		return
	}

	function update_relative_times(dry_run)
	{
		if (!dry_run)
		{
			for (const update of get_time_updater().updaters)
			{
				update()
			}
		}

		get_time_updater().timer = setTimeout(update_relative_times, get_time_updater().interval)
	}

	update_relative_times(true)
}

function stop_relative_times_updater()
{
	if (get_time_updater().timer)
	{
		clearTimeout(get_time_updater().timer)
		get_time_updater().timer = undefined
	}
}