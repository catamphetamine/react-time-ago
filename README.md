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
npm install intl-messageformat --save
npm install javascript-time-ago --save
npm install react-time-ago --save
```

This package assumes that the [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) global object exists in the runtime. `Intl` is present in all modern browsers [_except_ Internet Explorer 10 and Safari 9](http://caniuse.com/#search=intl) (which can be solved with the Intl polyfill).

Node.js starting from `0.12` has the `Intl` APIs built-in, but only includes English locale data by default. If your app needs to support more locales than English on server side then you'll need to [get Node to load the extra locale data](https://github.com/nodejs/node/wiki/Intl), or (a much simpler approach) just install the Intl polyfill.

If you decide you need the Intl polyfill then [here are some basic installation and configuration instructions](https://github.com/catamphetamine/javascript-time-ago#intl-polyfill-installation)

## Usage

First, the library must be initialized with a set of desired locales.

#### ./javascript-time-ago.js

```js
// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
// http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
//
// `IntlMessageFormat` global variable must exist
// in order for this to work:
// https://github.com/yahoo/intl-messageformat/issues/159
// For Webpack this is done via `ProvidePlugin` (see below).
//
import 'intl-messageformat/dist/locale-data/en'
import 'intl-messageformat/dist/locale-data/ru'

// Time ago formatter.
import javascriptTimeAgo from 'javascript-time-ago'
// And its React component.
import reactTimeAgo from 'react-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locales/en'
import ru from 'javascript-time-ago/locales/ru'

// Add locale-specific relative date/time formatting rules.
javascriptTimeAgo.locale(en)
javascriptTimeAgo.locale(ru)
```

`javascript-time-ago` uses `intl-messageformat` internally. [`IntlMessageFormat`](https://github.com/yahoo/intl-messageformat) is a helper library made by Yahoo which formats plurals internationally (e.g. "1 second", "2 seconds", etc).

Both these libraries must be initialized with a set of desired locales first. For that, `IntlMessageFormat` [needs to be accessible as a global variable](https://github.com/yahoo/intl-messageformat/issues/159) (though I don't agree with such a design choice). For Webpack that would be:

```js
plugins: [
  new webpack.ProvidePlugin({
    IntlMessageFormat: ['intl-messageformat', 'default'],
  }),
  // ...
]
```

After the initialization step is complete it is ready to format relative dates.

#### LastSeen.js

```js
import React from 'react'
import ReactTimeAgo from 'react-time-ago'

export default function LastSeen({ date }) {
  return (
    <div>
      Last seen:
      <ReactTimeAgo>{date}</ReactTimeAgo>
    </div>
  )
}
```

The React component refreshes itself as the time goes by.

## Customization

The `ReactTimeAgo` component accepts a `timeStyle` property which can be one of

  * [`twitter`](https://github.com/catamphetamine/javascript-time-ago#twitter-style)
  * [`fuzzy`](https://github.com/catamphetamine/javascript-time-ago#fuzzy-style)
  * [`{ gradation, units, flavour, override() }`](https://github.com/catamphetamine/javascript-time-ago#customization)

## Localization

Refer to [`javascript-time-ago` docs](https://github.com/catamphetamine/javascript-time-ago#localization).

## Props

```js
// Preferred locale.
// E.g. 'ru-RU'.
locale : PropTypes.string,

// Preferred locales (ordered).
// E.g. `['ru-RU', 'en-GB']`.
locales : PropTypes.arrayOf(PropTypes.string),

// The date to format.
// Alternatively can be passed as a child.
// E.g. `new Date()`.
date : PropTypes.instanceOf(Date),

// The date to format.
// Alternatively can be passed as a child.
// E.g. `1355972400000`.
time : PropTypes.number,

// Date/time formatting style.
// E.g. 'twitter', 'fuzzy', or custom (`{ gradation: […], units: […], flavour: 'long', override: function }`)
timeStyle : PropTypes.any,

// An optional function returning what will be output in the HTML `title` tooltip attribute.
// (by default it's (date) => new Intl.DateTimeFormat(locale, {…}).format(date))
full : PropTypes.func,

// `Intl.DateTimeFormat` format for the HTML `title` tooltip attribute.
// Is used when `full` is not specified.
// By default outputs a verbose full date.
dateTimeFormat : PropTypes.object,

// How often to update all `<ReactTimeAgo/>`s on a page.
// (once a minute by default)
updateInterval : PropTypes.number,

// Set to `false` to disable automatic refresh as time goes by.
tick : PropTypes.bool,

// CSS `style` object.
// E.g. `{ color: white }`.
style : PropTypes.object,

// CSS class name
className : PropTypes.string
```

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
  return (
    <Tooltip text={ verbose }>
      { children }
    </Tooltip>
  )
}
```

## Future

When given future dates `.format()` produces the corresponding output, e.g. "in 5 minutes", "in a year", etc.

## Webpack

On-demand module loading example (this is an advanced topic and should be skipped unless you know that you really need it):

```js
import isIntlLocaleSupported from 'intl-locales-supported'

export default async function internationalize(locale) {
  await loadIntlPolyfill(locale)
  const [_, javascriptTimeAgoData] = await loadLocaleSpecificData(locale)
  javascriptTimeAgo.locale(javascriptTimeAgoData)
}

// Loads `Intl` polyfill and its locale-specific data.
async function loadIntlPolyfill(locale) {
  if (window.Intl && is_intl_locale_supported(locale)) {
    // `Intl` is in the global scope and the locale data is available
    return
  }
  await Promise.all([
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

## License

[MIT](LICENSE)