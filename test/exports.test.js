import ReactTimeAgo from '../index.js'
import Library from '../index.cjs'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)

describe('exports', () => {
	it('should export ES6', () => {
		expect(ReactTimeAgo.type.name).to.equal('ReactTimeAgo')
	})

	it('should export CommonJS', () => {
		expect(Library.type.name).to.equal('ReactTimeAgo')
		expect(Library.default.type.name).to.equal('ReactTimeAgo')
	})
})