/**
 * Whether can use `Intl.DateTimeFormat` for these `locales`.
 * Returns the first suitable one.
 * @param  {(string|string[])} locales
 * @return {?string} The first locale that can be used.
 */
export function intlDateTimeFormatSupportedLocale(locales) {
	/* istanbul ignore else */
	if (intlDateTimeFormatSupported()) {
		return Intl.DateTimeFormat.supportedLocalesOf(locales)[0]
	}
}

/**
 * Whether can use `Intl.DateTimeFormat`.
 * @return {boolean}
 */
export function intlDateTimeFormatSupported() {
	// Babel transforms `typeof` into some "branches"
	// so istanbul will show this as "branch not covered".
	/* istanbul ignore next */
	const isIntlAvailable = typeof Intl === 'object'
	return isIntlAvailable && typeof Intl.DateTimeFormat === 'function'
}
