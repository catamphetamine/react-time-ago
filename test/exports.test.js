import ReactTimeAgo from '../index'

import TimeAgo from 'javascript-time-ago'
TimeAgo.locale(require('javascript-time-ago/locale/en'))

describe('exports', () => {
	it('should export ES6', () => {
		expect(ReactTimeAgo.type.name).to.equal('ReactTimeAgo')
	})

	it('should export CommonJS', () => {
		const Library = require('../index.commonjs')
		expect(Library.type.name).to.equal('ReactTimeAgo')
		expect(Library.default.type.name).to.equal('ReactTimeAgo')
	})
})