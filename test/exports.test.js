import ReactTimeAgo, { useTimeAgo } from '../index.js'
import Library from '../index.cjs'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.locale(en)

describe('exports', () => {
	it('should export ES6', () => {
		expect(ReactTimeAgo.type.name).to.equal('ReactTimeAgo')
		expect(useTimeAgo).to.be.a('function')
	})

	it('should export CommonJS', () => {
		expect(Library.type.name).to.equal('ReactTimeAgo')
		expect(Library.default.type.name).to.equal('ReactTimeAgo')
		expect(Library.useTimeAgo).to.be.a('function')
	})
})