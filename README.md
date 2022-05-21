# react-time-ago

[![npm version](https://img.shields.io/npm/v/react-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/react-time-ago)

Localized relative date/time formatting (both for past and future dates).

Automatically chooses the right units (seconds, minutes, etc) to format a time interval.

Automatically refreshes itself.

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

The `react-time-ago` component uses [`javascript-time-ago`](https://gitlab.com/catamphetamine/javascript-time-ago) library for generating date/time labels, so both of these packages should be installed:

```sh
$ npm install react-time-ago javascript-time-ago --save
```

If you're not using a bundler then use a [standalone version from a CDN](#cdn).

## Use

First, `javascript-time-ago` must be [initialized](https://github.com/catamphetamine/javascript-time-ago#locales) with some locales:

#### ./src/index.js

```js
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)
```

Then, use `<ReactTimeAgo/>` component:

#### ./src/LastSeen.js

```js
import React from 'react'
import ReactTimeAgo from 'react-time-ago'

export default function LastSeen({ date }) {
  return (
    <div>
      Last seen: <ReactTimeAgo date={date} locale="en-US"/>
    </div>
  )
}
```

## Style

`<ReactTimeAgo/>` component accepts an optional `timeStyle` property — it should be a `javascript-time-ago` [style](https://github.com/catamphetamine/javascript-time-ago#styles): either a built-in style name (like `"round"`, `"round-minute"`, `"twitter"`, etc) or a [custom](https://github.com/catamphetamine/javascript-time-ago#custom) style object.

```js
<ReactTimeAgo date={date} locale="en-US" timeStyle="twitter"/>
```

## React Native

By default, this component renders a `<time/>` HTML tag. When using this component in React Native, pass a custom `component` property:

```js
import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from 'react-time-ago'

export default function TimeAgo(props) {
  return <ReactTimeAgo {...props} component={Time}/>
}

function Time({ date, verboseDate, tooltip, children }) {
  return <Text>{children}</Text>
}

Time.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  verboseDate: PropTypes.string,
  tooltip: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired
}
```

## Tooltip

By default, the standard HTML `title` attribute is used to display a tooltip with the verbose date on mouse over.

For custom tooltip design, a custom tooltip component could be rendered. For that, `<ReactTimeAgo/>` supports properties:

* `tooltip={false}` — Instructs the component not to add the default HTML `title` attribute.
* `wrapperComponent` — A React component that's gonna wrap the date/time label. Receives properties: `children` (Example: `<time>2 days ago</time>`) and `verboseDate: string` (Example: "Wednesday, January 1, 2000, 10:45:10 PM").
* `wrapperProps` — If defined, these properties are passed through to the `wrapperComponent`.

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
  // `verboseDate` is not generated on server side
  // (because tooltips are only shown on mouse over),
  // so it's not declared a "required" property.
  verboseDate: PropTypes.string,
  children: PropTypes.node.isRequired
}
```

## Future

When given future dates, `.format()` produces the corresponding output.: `"in 5 minutes"`, `"in 10 days"`, etc.

To restrict the formatted date to be future-only, pass `future` property, and it will stop when it reaches "zero point" (`"in a moment"`) and won't allow the `date` to be formatted as a past one.

```js
<ReactTimeAgo future date={date} .../>
```

<!--
## ES6

This library uses ES6 `Set` so any ES6 polyfill for `Set` is required (e.g. `import 'babel-polyfill'` or `import 'core-js/fn/set'`).
-->

## CDN

One can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.com](https://jsdelivr.com)

```html
<!-- Example `[version]`: `2.x` -->
<script src="https://unpkg.com/javascript-time-ago@[version]/bundle/javascript-time-ago.js"></script>
<script src="https://unpkg.com/react-time-ago@[version]/bundle/react-time-ago.js"></script>

<script>
  TimeAgo.addDefaultLocale({
    locale: 'en',
    now: {
      now: {
        current: "now",
        future: "in a moment",
        past: "just now"
      }
    },
    long: {
      year: {
        past: {
          one: "{0} year ago",
          other: "{0} years ago"
        },
        future: {
          one: "in {0} year",
          other: "in {0} years"
        }
      },
      ...
    }
  })
</script>

<script>
  ...
  <ReactTimeAgo date={new Date()} locale="en-US" timeStyle="twitter"/>
  ...
</script>
```

## Props

```js
// The `date` (or `timestamp`).
// E.g. `new Date()` or `1355972400000`.
date: PropTypes.oneOfType([
  PropTypes.instanceOf(Date),
  PropTypes.number
]).isRequired,

// Preferred locale.
// Is 'en' by default.
// E.g. 'ru-RU'.
locale: PropTypes.string,

// Alternatively to `locale`, one could pass `locales`:
// A list of preferred locales (ordered).
// Will choose the first supported locale from the list.
// E.g. `['ru-RU', 'en-GB']`.
locales: PropTypes.arrayOf(PropTypes.string),

// If set to `true`, then will stop at "zero point"
// when going from future dates to past dates.
// In other words, even if the `date` has passed,
// it will still render as if `date` is `now`.
future: PropTypes.bool,

// Date/time formatting style.
// See `javascript-time-ago` docs on "Styles" for more info.
// E.g. 'round', 'round-minute', 'twitter', 'twitter-first-minute'.
timeStyle: PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object
]),

// `round` parameter of `javascript-time-ago`.
// See `javascript-time-ago` docs on "Rounding" for more info.
// Examples: "round", "floor".
round: PropTypes.string,

// A React component to render the relative time label.
// Receives properties:
// * date: Date — The date.
// * verboseDate: string — Formatted verbose date.
// * tooltip: boolean — The `tooltip` property of `<ReactTimeAgo/>` component.
// * children: string — The relative time label.
// * All "unknown" properties that have been passed to `<ReactTimeAgo/>` are passed through to this component.
component: PropTypes.elementType.isRequired,

// Whether to use HTML `tooltip` attribute to show a verbose date tooltip.
// Is `true` by default.
// Can be set to `false` to disable the native HTML `tooltip`.
tooltip: PropTypes.bool.isRequired,

// Allows setting a custom baseline for relative time measurement.
// https://gitlab.com/catamphetamine/react-time-ago/-/issues/4
now: PropTypes.number,

// Allows offsetting the `date` by an arbitrary amount of milliseconds.
// https://gitlab.com/catamphetamine/react-time-ago/-/issues/4
timeOffset: PropTypes.number,

// Pass `false` to use native `Intl.RelativeTimeFormat` / `Intl.PluralRules`
// instead of the polyfilled ones in `javascript-time-ago`.
polyfill: PropTypes.bool,

// Verbose date formatter.
// By default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`.
formatVerboseDate: PropTypes.func,

// `Intl.DateTimeFormat` format for formatting verbose date.
// See `Intl.DateTimeFormat` docs for more info.
verboseDateFormat: PropTypes.object,

// (advanced)
// A React Component to wrap the resulting `<time/>` React Element.
// Receives `verboseDate` and `children` properties.
// Also receives `wrapperProps`, if they're passed.
// `verboseDate` can be used for displaying verbose date label
// in an "on mouse over" (or "on touch") tooltip.
// See the "Tooltip" readme section for more info.
// Another example could be having `wrapperComponent`
// being rerendered every time the component refreshes itself.
wrapperComponent: PropTypes.func,

// Custom `props` passed to `wrapperComponent`.
wrapperProps: PropTypes.object
```

## TypeScript

This library comes with TypeScript "typings". If you happen to find any bugs in those, create an issue.

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to [GitLab](https://gitlab.com/catamphetamine/react-time-ago). GitHub repo is now deprecated, and the latest source codes can be found on GitLab, which is also the place to report any issues.

## License

[MIT](LICENSE)
