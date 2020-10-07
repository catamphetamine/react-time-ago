# react-time-ago

[![npm version](https://img.shields.io/npm/v/react-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/react-time-ago)

Intelligent, international, higly customizable relative date/time formatter (both for past and future dates).

Automatically chooses the right units (seconds, minutes, etc) to format a time interval.

[See Demo](https://catamphetamine.gitlab.io/react-time-ago/)

Examples:

  * just now
  * 45s
  * 5m
  * 15 minutes ago
  * 3 hours ago
  * in 2 months
  * in 5 years
  * …

## Install

```sh
$ npm install react-time-ago --save
```

This component uses [`javascript-time-ago`](https://gitlab.com/catamphetamine/javascript-time-ago) library internally for generating date/time labels. When `react-time-ago` package is installed, it automatically installs `javascript-time-ago` package as a dependency, so there's no need to install `javascript-time-ago` manually.

## Use

First, `javascript-time-ago` must be initialized with a list of supported locales:

#### ./src/index.js

```js
import JavascriptTimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

JavascriptTimeAgo.addLocale(en)
JavascriptTimeAgo.addLocale(ru)
```

Then, `<ReactTimeAgo/>` component can be used anywhere:

#### ./src/LastSeen.js

```js
import React from 'react'
import ReactTimeAgo from 'react-time-ago'

export default function LastSeen({ date }) {
  return (
    <div>
      Last seen: <ReactTimeAgo date={date}/>
    </div>
  )
}
```

`<ReactTimeAgo/>` accepts an optional `locale` (or `locales`) property (which is `"en"` by default):

```js
// Displays relative time in Russian.
<ReactTimeAgo date={date} locale="ru"/>
```

The component periodically refreshes itself (by default, a "smart" autoupdate interval is used: every minute for the first hour, then every 10 minutes for the first 12 hours, and so on).

## Customization

`ReactTimeAgo` component accepts a `style` property which can be:

  * [`"round"`](https://github.com/catamphetamine/javascript-time-ago#round)
  * [`"round-minute"`](https://github.com/catamphetamine/javascript-time-ago#round-minute)
  * [`"twitter"`](https://github.com/catamphetamine/javascript-time-ago#twitter)
  * [`"approximate"`](https://github.com/catamphetamine/javascript-time-ago#approximate)
  * [`"time"`](https://github.com/catamphetamine/javascript-time-ago#approximate-time)
  * [`{ gradation, units, flavour }`](https://github.com/catamphetamine/javascript-time-ago#custom) object

See [`javascript-time-ago` docs](https://github.com/catamphetamine/javascript-time-ago#advanced) for more info on how to customize the generated output.

## Tooltip

By default, the standard HTML `title` attribute is used, which shows a standard web browser tooltip on mouse over. The tooltip text is a verbose date label. If [`Intl`](https://caniuse.com/#search=intl) is supported (which is the case for all modern web browsers) then [`Intl.DateTimeFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) is used for formatting the label (`"Thursday, January 11, 2018, 9:53:00 PM"`). Otherwise, it falls back to `date.toString()`.

For custom tooltip design, a custom tooltip component could be rendered. For that, `<ReactTimeAgo/>` supports properties:

* `tooltip={false}` — Instructs the component not to add the default HTML `title` attribute.
* `wrapperComponent` — A React component that's gonna wrap the date/time label. Will receive `children` and `verboseDate: string` properties, `verboseDate` being verbose date/time label (for example, "Wednesday, January 1, 2000, 10:45:10 PM").
* `wrapperProps` — If passed, these properties will be passed through to the `wrapperComponent`.

For example, here's how to render a [`react-responsive-ui/Tooltip`](https://catamphetamine.gitlab.io/react-responsive-ui/#tooltip):

```js
import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'react-responsive-ui/commonjs/Tooltip'
import ReactTimeAgo from 'react-time-ago'
import 'react-time-ago/Tooltip.css'

export default function ReactTimeAgoWithTooltip(props) {
  return (
    <ReactTimeAgo
      {...props}
      wrapperComponent={TooltipContainer}
      tooltip={false}/>
  )
}

const TooltipContainer = ({ verboseDate, children, ...rest }) => (
  <Tooltip {...rest} content={verboseDate}>
    {children}
  </Tooltip>
)

TooltipContainer.propTypes = {
  verboseDate: PropTypes.string,
  children: PropTypes.node.isRequired
}
```

## Future

When given future dates it produces the corresponding output, e.g. "in 5 minutes", "in a year", etc.

<!--
## ES6

This library uses ES6 `Set` so any ES6 polyfill for `Set` is required (e.g. `import 'babel-polyfill'` or `import 'core-js/fn/set'`).
-->

## Props

```js
// The `date` (or `timestamp`).
// E.g. `new Date()` or `1355972400000`.
date : PropTypes.oneOfType([
  PropTypes.instanceOf(Date),
  PropTypes.number
]).isRequired,

// Preferred locale.
// Is 'en' by default.
// E.g. 'ru-RU'.
locale : PropTypes.string,

// Preferred locales (ordered).
// Will choose the first suitable locale from this list.
// (the one that has been initialized)
// E.g. `['ru-RU', 'en-GB']`.
locales : PropTypes.arrayOf(PropTypes.string),

// Date/time formatting style.
// E.g. 'round', 'round-minute', 'twitter', 'approximate', 'time', or an object.
// See `javascript-time-ago` docs for more info.
timeStyle : PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object
]),

// Whether HTML `tooltip` attribute should be set
// to verbosely formatted date (is `true` by default).
// Set to `false` to disable the native HTML `tooltip`.
tooltip : PropTypes.bool.isRequired,

// An optional function returning what will be output in the HTML `title` tooltip attribute.
// (by default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`)
formatVerboseDate : PropTypes.func,

// `Intl.DateTimeFormat` format for the HTML `title` tooltip attribute.
// Is used when `formatVerboseDate` is not specified.
// By default outputs a verbose date.
verboseDateFormat : PropTypes.object,

// How often to update all `<ReactTimeAgo/>` elements on a page.
// (is once in a minute by default)
// This setting is only used for "custom" `style`s.
// For standard `style`s, "smart" autoupdate interval is used:
// every minute for the first hour, then every 10 minutes for the first 12 hours, and so on.
updateInterval : PropTypes.number,

// Set to `false` to disable automatic refresh of
// `<ReactTimeAgo/>` elements on a page as time goes by.
// (is `true` by default)
tick : PropTypes.bool,

// (advanced)
// React Component to wrap the resulting `<time/>` React Element.
// Receives `verboseDate` and `children` properties.
// Also receives `wrapperProps`, if they're passed.
// `verboseDate` can be used for displaying verbose date label
// in an "on mouse over" (or "on touch") tooltip.
// See the "Tooltip" section for usage example.
// Another example could be `wrapperComponent`
// getting rerendered every time `<time/>` is rerendered.
wrapperComponent : PropTypes.func,

// (advanced)
// Custom `props` passed to `wrapperComponent`.
wrapperProps : PropTypes.object,

// CSS `style` object.
// E.g. `{ color: white }`.
style : PropTypes.object,

// CSS class name.
className : PropTypes.string
```

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to [GitLab](https://gitlab.com/catamphetamine/react-time-ago). GitHub repo is now deprecated, and the latest source codes can be found on GitLab, which is also the place to report any issues.

## License

[MIT](LICENSE)
