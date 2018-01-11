import
{
	default as WithTooltip,
	TimeAgo as ReactTimeAgo
}
from '../index'

import javascript_time_ago from 'javascript-time-ago'
javascript_time_ago.locale(require('javascript-time-ago/locale/en'))

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		new ReactTimeAgo({ locale: 'en-US' }, {})
		WithTooltip({ locale: 'en-US' })
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.commonjs')

		new Library.TimeAgo({ locale: 'en-US' }, {})
		Library.default({ locale: 'en-US' })
		Library({ locale: 'en-US' })
	})
})