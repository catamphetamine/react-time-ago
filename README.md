# react-time-ago

[![NPM Version][npm-badge]][npm]
<!-- [![Build Status][travis-badge]][travis] -->
<!-- [![Test Coverage][coveralls-badge]][coveralls] -->

International higly customizable relative date/time formatter for React (both for past and future dates).

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

This package assumes that the [`Intl`][Intl] global object exists in the runtime. `Intl` is present in all modern browsers _except_ Safari (which can be solved with the Intl polyfill).

Node.js 0.12 has the `Intl` APIs built-in, but only includes the English locale data by default. If your app needs to support more locales than English, you'll need to [get Node to load the extra locale data](https://github.com/nodejs/node/wiki/Intl), or (a much simpler approach) just install the Intl polyfill.

If you decide you need the Intl polyfill then [here are some basic installation and configuration instructions](#intl-polyfill-installation)

## Usage

#### application.js

```js
import react_time_ago from 'react-time-ago'

// Load locale specific relative date/time messages
//
import javascript_time_ago from 'javascript-time-ago'
javascript_time_ago.locale(require('javascript-time-ago/locales/en'))
javascript_time_ago.locale(require('javascript-time-ago/locales/ru'))

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be 
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
//
global.IntlMessageFormat = require('intl-messageformat')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')

// Initialization complete.
// Ready to format relative dates and times.
```

#### ReactComponent.js

```js
import React from 'react'
import ReactTimeAgo from 'react-time-ago'

export default class ReactTimeAgo extends React.Component
{
  render()
  {
    return (
      <div className="user-profile__last-seen">
        Last seen:
        <ReactTimeAgo date={this.props.date} className="user-profile__last-seen__time"/>
      </div>
    )
  }
}
```

## Customization

The `ReactTimeAgo` component accepts a `style` property which can be one of

  * [`twitter`](https://github.com/halt-hammerzeit/javascript-time-ago#twitter-style)
  * [`fuzzy`](https://github.com/halt-hammerzeit/javascript-time-ago#fuzzy-style)
  * [`{ gradation, units, flavour }`](https://github.com/halt-hammerzeit/javascript-time-ago#customization)

## Localization

Refer to [`javascript-time-ago` docs](https://github.com/halt-hammerzeit/javascript-time-ago#localization).

## Props

```js
// 'ru-RU', 'en-GB'
locale           : PropTypes.string,

// new Date()
date             : PropTypes.instanceOf(Date),

// or 1355972400000
time             : PropTypes.number,

// e.g. 'twitter', 'fuzzy', { gradation: […], units: […], flavour: 'long'}
style            : PropTypes.any,

// a function returning what's output in the tooltip
// (by default is (date) => new Intl.DateTimeFormat('en-US', {…}).format(date))
full             : PropTypes.func,

// the `{…}` in the default `full` function
date_time_format : PropTypes.object,

// how often to update <ReactTimeAgo/>s
// (once a minute by default)
update_interval  : PropTypes.number,

// e.g. { color: white }
css_style        : PropTypes.object,

// CSS class name
className        : PropTypes.string
```

## Webpack

On-demand module loading example (this is an advanced topic and this code is not neccessary to make the whole thing work, it's just an optimization for those who need it):

```js
import is_intl_locale_supported from 'intl-locales-supported'

global.IntlMessageFormat = require('intl-messageformat')

function load_locale_data(locale)
{
  return new Promise(resolve =>
  {
    switch (get_language_from_locale(locale))
    {
      // russian
      case 'ru':
        if (!is_intl_locale_supported('ru'))
        {
          // download both intl locale data and relative time specific
          // locale data for this language
          require.ensure
          ([
            'intl/locale-data/jsonp/ru',
            'intl-messageformat/dist/locale-data/ru',
            'javascript-time-ago/locales/ru'
          ],
          require =>
          {
            require('intl/locale-data/jsonp/ru')

            require('intl-messageformat/dist/locale-data/ru')
            javascript_time_ago.locale(require('javascript-time-ago/locales/ru'))
            
            resolve()
          },
          'locale-ru-with-intl')
        }
        else
        {
          // download just relative time specific locale data for this language
          require.ensure
          ([
            'intl-messageformat/dist/locale-data/ru',
            'javascript-time-ago/locales/ru'
          ],
          require =>
          {
            require('intl-messageformat/dist/locale-data/ru')
            javascript_time_ago.locale(require('javascript-time-ago/locales/ru'))
            
            resolve()
          },
          'locale-ru')
        }
        break

      … // other locales
    }
  }
}
```

A working example project can be found [here](https://github.com/halt-hammerzeit/webapp). `react-time-ago` is used there, for example, on user profile pages to display how long ago the user has been online.

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
[npm]: https://www.npmjs.org/package/react-time-ago
[npm-badge]: https://img.shields.io/npm/v/react-time-ago.svg?style=flat-square
[travis]: https://travis-ci.org/halt-hammerzeit/react-time-ago
[travis-badge]: https://img.shields.io/travis/halt-hammerzeit/react-time-ago/master.svg?style=flat-square
[CLDR]: http://cldr.unicode.org/
[Intl]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
[coveralls]: https://coveralls.io/r/halt-hammerzeit/react-time-ago?branch=master
[coveralls-badge]: https://img.shields.io/coveralls/halt-hammerzeit/react-time-ago/master.svg?style=flat-square
