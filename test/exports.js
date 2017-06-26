import
{
	default as ReactTimeAgo,
	Time_ago,
	Date_time_formatter
}
from '../index.es6'

import javascript_time_ago from 'javascript-time-ago'
javascript_time_ago.locale(require('javascript-time-ago/locales/en'))

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		new ReactTimeAgo({ locale: 'en-US' }, {})
		new Time_ago('en-US')
		new Date_time_formatter('en-US')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.common')

		new Library({ locale: 'en-US' }, {})
		new Library.default({ locale: 'en-US' }, {})
		new Library.Time_ago('en-US')
		new Library.Date_time_formatter('en-US')
	})
})