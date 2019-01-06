import {
	default as ReactTimeAgo,
} from '../index'

import javascript_time_ago from 'javascript-time-ago'
javascript_time_ago.locale(require('javascript-time-ago/locale/en'))

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		new ReactTimeAgo({ locale: 'en-US', children: new Date() })
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')

		new Library({ locale: 'en-US', children: new Date() })
		new Library.default({ locale: 'en-US', children: new Date() })
	})
})