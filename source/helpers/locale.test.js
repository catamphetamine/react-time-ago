import { chooseOneSupportedLocale } from './locale.js'

describe('locale', () => {
	it(`should tell if can use Intl for date formatting`, () => {
		expect(chooseOneSupportedLocale('en')).to.equal('en')
		expect(chooseOneSupportedLocale('en-XX')).to.equal('en-XX')
		expect(chooseOneSupportedLocale(['en', 'ru'])).to.equal('en')
	})
})