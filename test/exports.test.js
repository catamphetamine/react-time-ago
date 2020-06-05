import {
	default as ReactTimeAgo,
} from '../index'

import JavascriptTimeAgo from 'javascript-time-ago'
JavascriptTimeAgo.locale(require('javascript-time-ago/locale/en'))

describe('exports', () => {
	it('should export ES6', () => {
		expect(ReactTimeAgo).to.be.a('function')
	})
	it('should export CommonJS', () => {
		const Library = require('../index.commonjs')
		expect(Library).to.be.a('function')
		expect(Library.default).to.be.a('function')
	})
})