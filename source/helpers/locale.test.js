import { intlDateTimeFormatSupportedLocale } from './locale.js'

describe('locale', () => {
	it(`should tell if can use Intl for date formatting`, () => {
		expect(intlDateTimeFormatSupportedLocale('en')).to.equal('en')
		expect(intlDateTimeFormatSupportedLocale('en-XX')).to.equal('en-XX')
		expect(intlDateTimeFormatSupportedLocale(['en', 'ru'])).to.equal('en')
	})
})