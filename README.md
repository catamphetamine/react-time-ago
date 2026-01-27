# react-time-ago

[![npm version](https://img.shields.io/npm/v/react-time-ago.svg?style=flat-square)](https://www.npmjs.com/package/react-time-ago)

Formats a `Date` into a string like `"1 day ago"`. In any language.

  * just now
  * 45s
  * 5m
  * 15 minutes ago
  * 3 hours ago
  * 2 days ago
  * in 4 months
  * in 5 years
  * …

Automatically refreshes itself.

[See Demo](https://catamphetamine.gitlab.io/react-time-ago/)

## Install

```sh
$ npm install react-time-ago --save
```

Alternatively, one could include it on a web page [directly](#cdn) via a `<script/>` tag.

## Use

To begin, decide on the set of languages that your application will be translated into. For now, let's assume that it's gonna be just English.

Then, for each of those languages, import the language data:

```js
// Adds support for English language.
import "react-time-ago/locale/en"
```

Now you're ready to render a `<ReactTimeAgo/>` component for any of those languages.

```js
import React from "react"
import ReactTimeAgo from "react-time-ago"

export default function Example({ date }) {
  return (
    <div>
      Last seen: <ReactTimeAgo date={date} locale="en"/>
    </div>
  )
}
```

To change the output style, pass a `timeStyle` property: see the list of available [formatting styles](https://www.npmjs.com/package/javascript-time-ago#formatting-styles).

The label will automatically refresh itself.

## Hook

If you prefer using a React Hook rather than a React Component, the parameters for it are the same as the [props](#props) for the React component, excluding:

* `tooltip: boolean`
* `component: React.Component`
* `wrapperComponent: React.Component`
* `wrapperProps: object`

Example:

```js
import { useTimeAgo } from 'react-time-ago'

const result = useTimeAgo(parameters)
```

The hook returns an object with properties:

* `date: Date` — Same as the `date` input parameter. If the input parameter was a timestamp (`number`) then it gets converted to a `Date`.
* `formattedDate: string` — Formatted `date`. Example: `"5 min ago"`.
* `verboseDate: string` — Formatted `date` (verbose variant). Example: `"Thursday, December 20, 2012, 7:00:00 AM GMT+4"`.

## React Native

By default, this component renders a `<time/>` HTML element. When using this component in React Native, a developer should pass a custom `component` property that will be used instead of the `<time/>` HTML element. Example:

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

By default, a standard HTML `title` attribute is used to display a tooltip with the verbose date on when the user hovers the label.

If such "native" tooltip doesn't fit the application's design, a custom tooltip component could be rendered. For that, `<ReactTimeAgo/>` supports properties:

* `tooltip={false}` — Instructs the component to not add an HTML `title` attribute.
* `wrapperComponent` — Should be a React component that will wrap the label.
  * Properties:
    * `children` — Example: `<time>2 days ago</time>`
    * `verboseDate: string` — Example: "Wednesday, January 1, 2000, 10:45:10 PM"
* `wrapperProps` — If defined, these properties are simply passed through to the `wrapperComponent`.

Here's an example that renders a [`react-responsive-ui/Tooltip`](https://catamphetamine.gitlab.io/react-responsive-ui/#tooltip) instead of a "native" HTML `title` tooltip:

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

## Past vs Future

When given a past date, `.format()` returns an `"... ago"` label.

When given a future date, `.format()` returns an `"in ..."` label.

```js
<ReactTimeAgo date={Date.now() + 5 * 60 * 1000}/>
// "in 5 minutes"
```

When given a "now" date, which is neither past, nor future, `.format()` doesn't really know how it should represent the time difference — as `-0` or as `+0`.

By default, it treats it as `-0`, meaning that it will return `"0 seconds ago"` rather than `"in 0 seconds"`.

To instruct `.format()` to treat it as `+0`, pass `future: true` parameter.

```js
// Without `future: true`
<ReactTimeAgo date={Date.now()}/>
// "just now"

// With `future: true`
<ReactTimeAgo future date={Date.now()}/>
// "in a moment"
```

<!--
## ES6

This library uses ES6 `Set` so any ES6 polyfill for `Set` is required (e.g. `import 'babel-polyfill'` or `import 'core-js/fn/set'`).
-->

## CDN

To include this library directly via a `<script/>` tag on a page, one can use any npm CDN service, e.g. [unpkg.com](https://unpkg.com) or [jsdelivr.com](https://jsdelivr.com)

```html
<!-- Example `[version]`: `2.x` -->
<script src="https://unpkg.com/javascript-time-ago@[version]/bundle/javascript-time-ago.js"></script>
<script src="https://unpkg.com/react-time-ago@[version]/bundle/react-time-ago.js"></script>

<script>
  TimeAgo.addLocale({
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
  <ReactTimeAgo date={new Date()} locale="en" timeStyle="twitter"/>
  ...
</script>
```

## Props

```js
// `date: Date` or `timestamp: number`.
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

// When `future` is set to `true` and `date` is equal to `Date.now()`,
// it will format it as "in 0 seconds" rather than "0 seconds ago".
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

// When `freezeAt` timestamp is specified, the label will stop refreshing
// itself when `Date.now()` becomes equal to `freezeAt`.
// For example, if `freezeAt = Date.now() + 60 * 1000` is passed,
// the label will refresh itself for 1 minute, after which it will freeze
// and stop refreshing itself.
freezeAt: PropTypes.number,

// A React component to render the relative time label.
// Receives properties:
// * date: Date — The date.
// * verboseDate: string — Formatted verbose date.
// * tooltip: boolean — The `tooltip` property of `<ReactTimeAgo/>` component.
// * children: string — The relative time label.
// * All "unknown" properties that have been passed to `<ReactTimeAgo/>` are passed through to this component.
component: PropTypes.elementType,

// Whether to use HTML `tooltip` attribute to show a verbose date tooltip.
// Is `true` by default.
// Can be set to `false` to disable the native HTML `tooltip`.
tooltip: PropTypes.bool,

// Verbose date formatter.
// By default it's `(date) => new Intl.DateTimeFormat(locale, {…}).format(date)`.
formatVerboseDate: PropTypes.func,

// `Intl.DateTimeFormat` format for formatting verbose date.
// See `Intl.DateTimeFormat` docs for more info.
verboseDateFormat: PropTypes.object,

// (deprecated)
// How often the component refreshes itself.
// When not provided, will use `getNextTimeToUpdate()` feature
// of `javascript-time-ago` styles to determine the update interval.
updateInterval: PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.shape({
    threshold: PropTypes.number,
    interval: PropTypes.number.isRequired
  }))
]),

// (deprecated).
// Set to `false` to disable automatic refresh of the component.
// Is `true` by default.
// I guess no one actually turns auto-update off, so this parameter is deprecated.
tick: PropTypes.bool,

// Allows setting a custom baseline for relative time measurement.
// https://gitlab.com/catamphetamine/react-time-ago/-/issues/4
now: PropTypes.number,

// Allows offsetting the `date` by an arbitrary amount of milliseconds.
// https://gitlab.com/catamphetamine/react-time-ago/-/issues/4
timeOffset: PropTypes.number,

// Pass `false` to use native `Intl.RelativeTimeFormat` / `Intl.PluralRules`
// instead of the polyfilled ones in `javascript-time-ago`.
polyfill: PropTypes.bool,

// (advanced)
// A React Component to wrap the resulting `<time/>` React Element.
// Receives `verboseDate` and `children` properties.
// Also receives `wrapperProps`, if they're passed.
// `verboseDate` can be used for displaying verbose date label
// in an "on mouse over" (or "on touch") tooltip.
// See the "Tooltip" readme section for more info.
// Another example could be having `wrapperComponent`
// being rerendered every time the component refreshes itself.
wrapperComponent: PropTypes.elementType,

// Custom `props` passed to `wrapperComponent`.
wrapperProps: PropTypes.object
```

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to [GitLab](https://gitlab.com/catamphetamine/react-time-ago). GitHub repo is now deprecated, and the latest source codes can be found on GitLab, which is also the place to report any issues.

## License

[MIT](LICENSE)
