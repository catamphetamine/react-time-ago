import { describe, it } from 'mocha'
import { expect } from 'chai'

import { getDate } from './date.js'

describe('helpers/date', () => {
	it('should convert Date/number to Date', () => {
		const today = new Date()
		expect(getDate(today.getTime()).getTime()).to.equal(today.getTime())
		expect(getDate(today).getTime()).to.equal(today.getTime())
	})

	it('should support mocked Dates when testing', () => {
		const mockedDate = { getTime: () => Date.now() }
		expect(getDate(mockedDate)).to.equal(mockedDate)
	})
})