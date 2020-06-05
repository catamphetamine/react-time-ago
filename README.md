# react-time-ago

[![npm version](https://img.shields.io/npm/v/react-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/react-time-ago)

International relative date/time formatter for React (both for past and future dates).

[See Demo](https://catamphetamine.github.io/react-time-ago/)

Formats a date/timestamp to:

  * just now
  * 5m
  * 15 min
  * 25 minutes
  * an hour ago
  * 1 mo.
  * 5 years ago
  * … or whatever else

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (and all my libraries) without any notice. I opened a support ticked but they didn't answer. Because of that, I had to move all my libraries to [GitLab](https://gitlab.com/catamphetamine).

## Install

```sh
$ npm install react-time-ago --save
```

This component uses [`javascript-time-ago`](https://github.com/catamphetamine/javascript-time-ago) library internally for generating date/time labels. When `react-time-ago` package is installed, it automatically installs `javascript-time-ago` package as a dependency, so there's no need to install `javascript-time-ago` manually.

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

`ReactTimeAgo` component accepts a `timeStyle` property which can be:

  * [`"twitter"`](https://github.com/catamphetamine/javascript-time-ago#twitter-style)
  * [`"time"`](https://github.com/catamphetamine/javascript-time-ago#just-time-style)
  * [`{ gradation, units, flavour }`](https://github.com/catamphetamine/javascript-time-ago#customization)

See [`javascript-time-ago` docs](https://github.com/catamphetamine/javascript-time-ago#advanced) for more info on how to customize the generated output.

## Tooltip

By default, the standard HTML `title` attribute is used, which shows a standard web browser tooltip on mouse over. The tooltip text is a verbose date label. If [`Intl`](https://caniuse.com/#search=intl) is supported (which is the case for all modern web browsers) then [`Intl.DateTimeFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) is used for formatting the label (`"Thursday, January 11, 2018, 9:53:00 PM"`). Otherwise, it falls back to `date.toString()`.

For custom tooltip design, a custom tooltip component could be rendered. For that, `<ReactTimeAgo/>` supports properties:

* `tooltip={false}` — Instructs the component not to add the default HTML `title` attribute.
* `container` — A React component that's gonna wrap the date/time label. All "unknown" properties will be passed through to the `container`. Also, the `container` will receive `verboseDate: string` property with the verbose date/time label.

For example, here's how to render a [`react-responsive-ui/Tooltip`](https://catamphetamine.github.io/react-responsive-ui/#tooltip):

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
      container={TooltipContainer}
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
// E.g. 'twitter', 'time', or an object.
// See `javascript-time-ago` docs for more info.
timeStyle,

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
// This setting is only used for "custom" `timeStyle`s.
// For standard `timeStyle`s, "smart" autoupdate interval is used:
// every minute for the first hour, then every 10 minutes for the first 12 hours, and so on.
updateInterval : PropTypes.number,

// Set to `false` to disable automatic refresh of
// `<ReactTimeAgo/>` elements on a page as time goes by.
// (is `true` by default)
tick : PropTypes.bool,

// (advanced)
// React Component to wrap the resulting `<time/>` React Element.
// Receives `verboseDate` and `children` properties.
// `verboseDate` can be used for displaying verbose date label
// in an "on mouse over" (or "on touch") tooltip.
// See "./source/ReactTimeAgoWithTooltip.js" for usage example.
container : PropTypes.func,

// CSS `style` object.
// E.g. `{ color: white }`.
style : PropTypes.object,

// CSS class name.
className : PropTypes.string
```

## License

[MIT](LICENSE)
