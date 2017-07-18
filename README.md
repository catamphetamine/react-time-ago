# react-time-ago

[![npm version](https://img.shields.io/npm/v/react-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/react-time-ago)

International higly customizable relative date/time formatter for React (both for past and future dates).

[See Demo](https://catamphetamine.github.io/react-time-ago/)

Formats a date to something like:

  * just now
  * 5m
  * 15 min
  * 25 minutes
  * half an hour ago
  * an hour ago
  * 2h
  * yesterday
  * 2d
  * 1wk
  * 2 weeks ago
  * 3 weeks
  * half a month ago
  * 1 mo. ago
  * 2 months
  * half a year
  * a year
  * 2yr
  * 5 years ago
  * … or whatever else

## Installation

```
npm install intl-messageformat@^1.3.0 --save
npm install javascript-time-ago --save
npm install react-time-ago --save
```

This package assumes that the [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) global object exists in the runtime. `Intl` is present in all modern browsers [_except_ Internet Explorer 10 and Safari 9](http://caniuse.com/#search=intl) (which can be solved with the Intl polyfill).

Node.js starting from `0.12` has the `Intl` APIs built-in, but only includes the English locale data by default. If your app needs to support more locales than English, you'll need to [get Node to load the extra locale data](https://github.com/nodejs/node/wiki/Intl), or (a much simpler approach) just install the Intl polyfill.

If you decide you need the Intl polyfill then [here are some basic installation and configuration instructions](https://github.com/catamphetamine/javascript-time-ago#intl-polyfill-installation)

## Usage

#### application.js

```js
import reactTimeAgo from 'react-time-ago'

// Load locale specific relative date/time messages
//
import javascriptTimeAgo from 'javascript-time-ago'
javascriptTimeAgo.locale(require('javascript-time-ago/locales/en'))
javascriptTimeAgo.locale(require('javascript-time-ago/locales/ru'))

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
// http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
//
require('javascript-time-ago/intl-messageformat-global')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')

// Initialization complete.
// Ready to format relative dates and times.
```

#### ReactComponent.js

```js
import React from 'react'
import ReactTimeAgo from 'react-time-ago'

export default class ReactTimeAgo extends React.Component {
  render() {
    return (
      <div>
        Last seen:
        <ReactTimeAgo>{this.props.date}</ReactTimeAgo>
      </div>
    )
  }
}
```

The React component refreshes itself as the time goes by.

## Customization

The `ReactTimeAgo` component accepts a `timeStyle` property which can be one of

  * [`twitter`](https://github.com/catamphetamine/javascript-time-ago#twitter-style)
  * [`fuzzy`](https://github.com/catamphetamine/javascript-time-ago#fuzzy-style)
  * [`{ gradation, units, flavour, override }`](https://github.com/catamphetamine/javascript-time-ago#customization)

## Localization

Refer to [`javascript-time-ago` docs](https://github.com/catamphetamine/javascript-time-ago#localization).

## Props

```js
// 'ru-RU', 'en-GB'
locale           : PropTypes.string,

// new Date()
date             : PropTypes.instanceOf(Date),

// or 1355972400000
time             : PropTypes.number,

// e.g. 'twitter', 'fuzzy', { gradation: […], units: […], flavour: 'long', override: function }
timeStyle        : PropTypes.any,

// a function returning what's output in the tooltip
// (by default is (date) => new Intl.DateTimeFormat(locale, {…}).format(date))
full             : PropTypes.func,

// the `{…}` in the default `full` function
dateTimeFormat   : PropTypes.object,

// how often to update <ReactTimeAgo/>s
// (once a minute by default)
updateInterval   : PropTypes.number,

// Set to `false` to disable automatic refresh as time goes by
tick             : PropTypes.bool,

// e.g. { color: white }
style            : PropTypes.object,

// CSS class name
className        : PropTypes.string
```

## Webpack

On-demand module loading example (this is an advanced topic and this code is not neccessary to make the whole thing work, it's just an optimization for those who need it):

```js
import isIntlLocaleSupported from 'intl-locales-supported'

require('javascript-time-ago/intl-messageformat-global')

export default function internationalize(locale) {
  return loadIntlPolyfill(locale).then(() => {
    return loadLocaleSpecificData(locale)
  }).then(([_, javascriptTimeAgoData]) => {
    javascriptTimeAgo.locale(javascriptTimeAgoData)
  })
}

// Loads `Intl` polyfill and its locale-specific data.
function loadIntlPolyfill(locale) {
  if (window.Intl && is_intl_locale_supported(locale)) {
    // `Intl` is in the global scope and the locale data is available
    return Promise.resolve()
  }
  return Promise.all([
    import(/* webpackChunkName: "intl" */ 'intl'),
    loadLanguageSpecificIntlData(locale)
  ])
}

// Loads `Intl` locale-specific data.
function loadLanguageSpecificIntlData(locale) {
  // Do not remove code duplication via an inline `${locale}` variable,
  // otherwise Webpack will include **all** contents
  // of the `intl/locale-data/jsonp` folder in the bundle.
  switch (getLanguageFromLocale(locale)) {
    // Russian
    case 'ru':
      return import('intl/locale-data/jsonp/ru.js')
    // English
    default:
      return import('intl/locale-data/jsonp/en.js')
  }
}

// Loads all locale-specific data
function loadLocaleSpecificData(locale) {
  // Do not remove code duplication via an inline `${locale}` variable,
  // otherwise Webpack will include **all** contents
  // of the locale data folders in the bundle.
  switch (getLanguageFromLocale(locale)) {
    // Russian
    case 'ru':
      return Promise.all([
        import('intl-messageformat/dist/locale-data/ru'),
        import('javascript-time-ago/locales/ru')
      ])
    // English
    default:
      return Promise.all([
        import('intl-messageformat/dist/locale-data/en'),
        import('javascript-time-ago/locales/en')
      ])
  }
}
```

A working example project can be found [here](https://github.com/catamphetamine/webapp). `react-time-ago` is used there, for example, on user profile pages to display how long ago the user has been online.

## Tooltip

The default tooltip is implemented using the standard HTML `title` attribute.

If a custom tooltip is desired it can be implemented the following way:

```js
import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import Tooltip from './tooltip'

export default function TimeAgo(props) {
  return <ReactTimeAgo {...props} wrapper={Wrapper}/>
}

function Wrapper({ verbose, children }) {
  return <Tooltip text={verbose}>{children}</Tooltip>
}
```

## Future

When given negative time intervals this library outputs future dates, like "in 5 minutes", "in a year", etc.

## Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

This module is written in ES6 and uses [Babel](http://babeljs.io/) for ES5
transpilation. Widely consumable JavaScript can be produced by running:

```sh
npm run build
```

Once `npm run build` has run, you may `import` or `require()` directly from
node.

When you're ready to test your new functionality on a real project, you can run

```sh
npm pack
```

It will `build`, `test` and then create a `.tgz` archive which you can then install in your project folder

```sh
npm install [module name with version].tar.gz
```

## License

[MIT](LICENSE)