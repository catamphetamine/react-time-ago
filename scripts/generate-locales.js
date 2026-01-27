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
				.replaceAll('{LOCALE_VARIABLE_NAME}', getLocaleVariableName(locale))
		)

		fs.writeFileSync(
			`./locale/${locale}/index.cjs`,
			LOCALE_INDEX_CJS
				.replaceAll('{LOCALE}', locale)
				.replaceAll('{LOCALE_VARIABLE_NAME}', getLocaleVariableName(locale))
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
import {LOCALE_VARIABLE_NAME} from "javascript-time-ago/locale/{LOCALE}"

TimeAgo.addLocale({LOCALE_VARIABLE_NAME})
`.trim()

const LOCALE_INDEX_CJS = `
var TimeAgo = require("javascript-time-ago")
var {LOCALE_VARIABLE_NAME} = require("javascript-time-ago/locale/{LOCALE}")

TimeAgo.addLocale({LOCALE_VARIABLE_NAME})
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
	"sideEffects": false
}
`.trim()

// Transforms a locale name to a javascript variable name.
// Example: "zh-Hant-MO" -> "zh_Hant_MO"
// Example: "en-001" -> "en_001"
function getLocaleVariableName(locale) {
	return locale.replace(/[^a-zA-Z_\d]/g, '_')
}

generateLocales()