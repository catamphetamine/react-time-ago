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

## Usage

```
npm install react-time-ago --save
# (installs "javascript-time-ago" as a dependency)
```

First, the library must be initialized with a set of desired locales.

```js
// Time ago formatter.
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

// Add locale-specific relative date/time formatting rules.
TimeAgo.locale(en)
TimeAgo.locale(ru)
```

After the initialization step is complete it is ready to format relative dates.

#### LastSeen.js

```js
import React from 'react'
import TimeAgo from 'react-time-ago'

export default function LastSeen({ date }) {
  return (
    <div>
      Last seen:
      <TimeAgo>{ date }</TimeAgo>
    </div>
  )
}
```

The React component refreshes itself as the time goes by.

## Customization

See [`javascript-time-ago` docs](https://github.com/catamphetamine/javascript-time-ago#advanced).

`TimeAgo` component accepts a `timeStyle` property which can be one of

  * [`"twitter"`](https://github.com/catamphetamine/javascript-time-ago#twitter-style)
  * [`"time"`](https://github.com/catamphetamine/javascript-time-ago#just-time-style)
  * [`{ gradation, units, flavour, override() }`](https://github.com/catamphetamine/javascript-time-ago#customization)

## Tooltip

The default "on mouse over" tooltip is implemented using the standard HTML `title` attribute and displays verbose date label. If `Intl` is supported then `Intl.DateTimeFormat` is used for formatting the verbose date label. Otherwise, simple `date.toString()` is used.

Using the standard HTML `title` attribute works for desktop web browsers but doesn't work for mobile users therefore a better solution is suggested such as using a custom tooltip component which displays itself on mouse over on desktops and on tap on mobile devices. An example of such component is `<Tooltip/>` from [`react-responsive-ui`](https://catamphetamine.github.io/react-responsive-ui/#tooltip).

```js
import { WithTooltip as TimeAgo } from 'react-time-ago'
import 'react-time-ago/Tooltip.css'

// Shows a verbose date tooltip on mouse over and on tap.
<TimeAgo .../>
```

## Future

When given future dates it produces the corresponding output, e.g. "in 5 minutes", "in a year", etc.

## Props

```js
// Preferred locale.
// E.g. 'ru-RU'.
locale : PropTypes.string,

// Preferred locales (ordered).
// E.g. `['ru-RU', 'en-GB']`.
locales : PropTypes.arrayOf(PropTypes.string),

// The `date` (or `timestamp`).
// E.g. `new Date()` or `1355972400000`.
children : PropTypes.oneOfType
([
  PropTypes.instanceOf(Date),
  PropTypes.number
])
.isRequired,

// Date/time formatting style.
// E.g. 'twitter', 'fuzzy', or custom (`{ gradation: […], units: […], flavour: 'long', override: function }`)
timeStyle : PropTypes.oneOfType
([
  PropTypes.string,
  PropTypes.shape
  ({
    gradation : PropTypes.arrayOf(PropTypes.shape
    ({
      name        : PropTypes.string.isRequired,
      granularity : PropTypes.number,
      threshold   : PropTypes.number,
      // Specific `threshold_[unit]` properties may also be defined
    })),
    units    : PropTypes.arrayOf(PropTypes.string),
    flavour  : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    override : PropTypes.func
  })
]),

// Whether HTML `tooltip` attribute should be set
// to verbosely formatted date (is `true` by default).
tooltip : PropTypes.bool.isRequired,

// An optional function returning what will be output in the HTML `title` tooltip attribute.
// (by default it's (date) => new Intl.DateTimeFormat(locale, {…}).format(date))
formatVerboseDate : PropTypes.func,

// `Intl.DateTimeFormat` format for the HTML `title` tooltip attribute.
// Is used when `formatVerboseDate` is not specified.
// By default outputs a verbose date.
verboseDateTimeFormat : PropTypes.object,

// How often to update all `<TimeAgo/>`s on a page.
// (once a minute by default)
updateInterval : PropTypes.number,

// Set to `false` to disable automatic refresh as time goes by.
tick : PropTypes.bool,

// React Component to wrap the resulting `<time/>` React Element.
// Receives `verboseDate` and `children` properties.
// `verboseDate` can be used for displaying verbose date label
// in an "on mouse over" (or "on touch") tooltip.
// See "./source/WithTooltip.js" for usage example.
container : PropTypes.func,

// CSS `style` object.
// E.g. `{ color: white }`.
style : PropTypes.object,

// CSS class name
className : PropTypes.string
```

## License

[MIT](LICENSE)