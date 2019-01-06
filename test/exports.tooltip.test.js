import {
	default as ReactTimeAgo
} from '../tooltip/index'

import javascript_time_ago from 'javascript-time-ago'
javascript_time_ago.locale(require('javascript-time-ago/locale/en'))

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		ReactTimeAgo({ locale: 'en-US', children: new Date() })
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../tooltip/index.commonjs')

		Library.default({ locale: 'en-US', children: new Date() })
		Library({ locale: 'en-US', children: new Date() })
	})
})