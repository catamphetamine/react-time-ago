import
{
	default as ReactTimeAgo
}
from '../index.es6'

import javascript_time_ago from 'javascript-time-ago'
javascript_time_ago.locale(require('javascript-time-ago/locale/en'))

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		new ReactTimeAgo({ locale: 'en-US' }, {})
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.common')

		new Library({ locale: 'en-US' }, {})
		new Library.default({ locale: 'en-US' }, {})
	})
})