import {
	default as ReactTimeAgo,
	// "Smart" autoupdate intervals should be moved to `javascript-time-ago`'s grading scale.
	// UPDATE_INTERVALS
} from '../index'

import JavascriptTimeAgo from 'javascript-time-ago'
JavascriptTimeAgo.locale(require('javascript-time-ago/locale/en'))

describe('exports', () => {
	it('should export ES6', () => {
		expect(ReactTimeAgo).to.be.a('function')
		// expect(UPDATE_INTERVALS).to.be.an('array')
	})
	it('should export CommonJS', () => {
		const Library = require('../index.commonjs')
		expect(Library).to.be.a('function')
		expect(Library.default).to.be.a('function')
		// expect(Library.UPDATE_INTERVALS).to.be.an('array')
	})
})