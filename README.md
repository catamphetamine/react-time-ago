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

## Install

```sh
$ npm install react-time-ago --save
```

## Use

This library exports two components: a "base" component and a "custom-tooltip" component:

```js
// "base" component.
import ReactTimeAgo from 'react-time-ago'

// "custom-tooltip" component.
// Requires React >= 16.
import ReactTimeAgo from 'react-time-ago/tooltip'
```

Both components use [`javascript-time-ago`](https://github.com/catamphetamine/javascript-time-ago) library internally for generating localized relative time strings. When `react-time-ago` package is installed the `javascript-time-ago` package is installed automatically along with it. At runtime the `javascript-time-ago` library must be initialized in the application's code with the desired locales (by default no locales are initialized):

#### ./src/index.js

```js
import JavascriptTimeAgo from 'javascript-time-ago'

// The desired locales.
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

// Initialize the desired locales.
JavascriptTimeAgo.locale(en)
JavascriptTimeAgo.locale(ru)
```

Now `<ReactTimeAgo/>` component can be used on any page. The component refreshes itself every minute (by default).

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

`<ReactTimeAgo/>` component takes an optional `locale` property (is `"en"` by default):

```js
// Displays relative time in Russian.
<ReactTimeAgo date={date} locale="ru"/>
```

## Customization

`ReactTimeAgo` component accepts a `timeStyle` property which can be:

  * [`"twitter"`](https://github.com/catamphetamine/javascript-time-ago#twitter-style)
  * [`"time"`](https://github.com/catamphetamine/javascript-time-ago#just-time-style)
  * [`{ gradation, units, flavour }`](https://github.com/catamphetamine/javascript-time-ago#customization)

See [`javascript-time-ago` docs](https://github.com/catamphetamine/javascript-time-ago#advanced) for more info on how to customize the generated output.

## Tooltip

The "custom-tooltip" component uses `react-responsive-ui`'s [`<Tooltip/>`](https://catamphetamine.github.io/react-responsive-ui/#tooltip) component internally that displays itself "on mouse over" on desktops and "on touch down" on mobile devices. The behavior of the tooltip is similar to that of the HTML `title` attribute which displays a tooltip "on mouse over". The difference is that the "custom-tooltip" component also displays the tooltip "on touch down" on mobile devices while the HTML `title` attribute doesn't handle mobile users in any way. That's the primary reason why one may choose the "custom-tooltip" component over the "base" (default) one.

The tooltip text is a verbose date label. If [`Intl`](https://caniuse.com/#search=intl) is supported (which is the case for all modern web browsers) then [`Intl.DateTimeFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) is used for formatting the label (`"Thursday, January 11, 2018, 9:53:00 PM"`). Otherwise, it falls back to `date.toString()`.

```js
import ReactTimeAgo from 'react-time-ago/tooltip'

// Include tooltip CSS:
import 'react-time-ago/Tooltip.css'
// Also make sure that `document.body` has no `margin`
// otherwise tooltip `left` and `top` positions will be slightly off.

// Shows a verbose date tooltip on mouse over and on touch down.
<ReactTimeAgo date={date}/>
```

```css
.rrui__tooltip {
  /* Display the tooltip above the content. */
  margin-top : -0.5em;
  background-color : black;
  color : white;
}

.rrui__tooltip--after-show {
  opacity : 0.85;
}

.rrui__tooltip--before-hide {
  opacity : 0;
}
```

The "custom-tooltip" component takes an optional `tooltipClassName` property for styling the tooltip.

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
