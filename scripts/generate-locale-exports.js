import fs from 'fs'

addLocaleExports(getLocales())

/**
 * Returns a list of all locales.
 * @return {string[]}
 */
function getLocales() {
	return fs.readdirSync('./locale', { withFileTypes: true })
		.filter(_ => _.isDirectory())
		.map(_ => _.name)
}

// Add `export` entries in `package.json`.
function addLocaleExports(locales) {
	// Read `package.json` file.
	const packageJson = readJsonFromFile('./package.json')

	// Remove all locale exports.
	for (const path of Object.keys(packageJson.exports)) {
		if (path.startsWith('./locale/')) {
			delete packageJson.exports[path]
		}
	}

	// Re-add all locale exports.
	packageJson.exports = {
		...packageJson.exports,
		...locales.reduce((all, locale) => {
			all[`./locale/${locale}`] = {
				types:  `./locale/${locale}/index.d.ts`,
				import: `./locale/${locale}/index.js`,
				require: `./locale/${locale}/index.cjs`
			}
			return all
		}, {})
	}

	// Save `package.json` file.
	fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
}

function readJsonFromFile(path) {
	return JSON.parse(fs.readFileSync(path, 'utf8'))
}
