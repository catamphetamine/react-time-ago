import fs from 'node:fs'

function generateLocales() {
	if (fs.existsSync('./locale')) {
		fs.rmSync('./locale', { recursive: true, force: true })
	}

	fs.mkdirSync('./locale')

	for (const locale of getLocales()) {
		fs.mkdirSync(`./locale/${locale}`)

		fs.writeFileSync(
			`./locale/${locale}/package.json`,
			LOCALE_PACKAGE_JSON
				.replaceAll('{LOCALE}', locale)
		)

		fs.writeFileSync(
			`./locale/${locale}/index.js`,
			LOCALE_INDEX_JS
				.replaceAll('{LOCALE}', locale)
		)

		fs.writeFileSync(
			`./locale/${locale}/index.cjs`,
			LOCALE_INDEX_CJS
				.replaceAll('{LOCALE}', locale)
		)

		fs.writeFileSync(
			`./locale/${locale}/index.d.ts`,
			LOCALE_INDEX_DTS
		)
	}
}

/**
 * Returns a list of all locales.
 * @return {string[]}
 */
function getLocales() {
	const javascriptTimeAgoLocalesPath = './node_modules/javascript-time-ago/locale'
	return fs.readdirSync(javascriptTimeAgoLocalesPath, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name)
}

const LOCALE_INDEX_DTS = ''

const LOCALE_INDEX_JS = `
import TimeAgo from "javascript-time-ago"
import localeData from "javascript-time-ago/locale/{LOCALE}"

TimeAgo.addLocale(localeData)
`.trim()

const LOCALE_INDEX_CJS = `
var TimeAgo = require("javascript-time-ago")
var localeData = require("javascript-time-ago/locale/{LOCALE}")

TimeAgo.addLocale(localeData)
`.trim()

const LOCALE_PACKAGE_JSON = `
{
	"private": true,
	"name": "react-time-ago/locale/{LOCALE}",
	"main": "./index.cjs",
	"module": "./index.js",
	"type": "module",
	"exports": {
		".": {
      "types": "./index.d.ts",
			"import": "./index.js",
			"require": "./index.cjs"
		}
	},
	"sideEffects": true
}
`.trim()

generateLocales()