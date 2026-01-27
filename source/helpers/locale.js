/**
 * From the list of `locales` it picks the first one
 * that is supported by `Intl.DateTimeFormat`.
 * @param  {(string|string[])} locales
 * @return {?string} The first locale that is supported, if any.
 */
export function chooseOneSupportedLocale(locales) {
	/* istanbul ignore else */
	if (isIntlDateTimeFormatSupported()) {
		return Intl.DateTimeFormat.supportedLocalesOf(locales)[0]
	}
}

/**
 * Whether the application can use `Intl.DateTimeFormat` class.
 * @return {boolean}
 */
export function isIntlDateTimeFormatSupported() {
	// Babel transforms `typeof` into some "branches"
	// so istanbul will show this as "branch not covered".
	/* istanbul ignore next */
	const isIntlAvailable = typeof Intl === 'object'
	return isIntlAvailable && typeof Intl.DateTimeFormat === 'function'
}
