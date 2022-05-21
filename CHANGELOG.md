<!-- TO DO: Maybe make `locale` not have any default and be a required property. -->

<!-- TO DO: Maybe remove `updateInterval` property. -->

<!-- TO DO: Maybe remove `tick` property. -->

7.2.0 / 21.05.2022
==================

* Migrated to "ES Module" exports.

7.1.2 / 27.09.2021
==================

* Added TypeScript "typings".

7.1.1 / 30.07.2021
==================

* [Added](https://gitlab.com/catamphetamine/react-time-ago/-/issues/4) `timeOffset` property.

7.1.0 / 27.07.2021
==================

* [Added](https://gitlab.com/catamphetamine/react-time-ago/-/issues/4) custom `now` property.

7.0.0 / 21.06.2021
==================

* `javascript-time-ago` is now a [peer dependency](https://gitlab.com/catamphetamine/react-time-ago/-/issues/2) and has to be installed explictly along with `react-time-ago`.

6.2.2 / 19.12.2020
==================

* The component now sets the "verbose date" tooltip after the component has mounted rather than on the first render. The reason is that otherwise React would complain that server-side-rendered markup doesn't match client-side-rendered one.

6.2.1 / 12.11.2020
==================

* [Added](https://github.com/catamphetamine/javascript-time-ago/issues/39) `component` property.

6.2.0 / 22.10.2020
==================

* Live updater now uses a single `requestAnimationFrame()` loop rather than individual `setTimeout()`s. The rationale is that Chrome has a [bug](https://www.npmjs.com/package/request-animation-frame-timeout) when handling `setTimeout()`s, and also `requestAnimationFrame()` aren't triggered when a tab is not visible (when the time doesn't need to be updated).

* Added `minTimeLeft: number` property (in seconds).

6.1.2 / 19.10.2020
==================

* Updated `javascript-time-ago` to fix the update interval.

6.1.1 / 11.10.2020
==================

* Renamed the bundle file from `react-time-ago.min.js` to `react-time-ago.js`, and `javascript-time-ago` dependency global variable is now `TimeAgo` rather than `window['javascript-time-ago'].default`.

6.1.0 / 09.10.2020
===================

* Updated to `getNextTimeToUpdate()` of the latest version of `javascript-time-ago`.

6.0.1 / 07.08.2020
===================

* Renamed `container` property to `wrapperComponent` (the older one still works).

* Added `wrapperProps` property.

6.0.0 / 05.06.2020
===================

* Rewrote in React Hooks (requires React >= 16.8).

* Fixed `locale` property dynamic update.

* Removed `/tooltip` and `/copy-text` exports.

* (misc) Removed deprecated `.default` CommonJS exports. Removed deprecated `/no-tooltip` export.

5.0.8 / 17.04.2020
===================

* By default, for standard `timeStyle`s, "smart" autoupdate interval is used now: every minute for the first hour, then every 10 minutes for the first 12 hours, and so on. Previously the default was "every minute".

5.0.0 / 14.01.2019
===================

  * (could be a breaking change for someone) Updated `javascript-time-ago` from version `1.x` to version `2.x`. See [migration guide](https://github.com/catamphetamine/javascript-time-ago/blob/master/MIGRATION.md) from version `1.x` to version `2.x`. If no custom `flavour`s were passed via `timeStyle` property then there are no breaking changes.

4.0.0 / 06.01.2019
===================

  * (breaking change) The library now only exports the non-custom-tooltip component from the default `react-time-ago` export. The custom-tooltip component can be imported from `react-time-ago/tooltip` subpackage.

  * (breaking change) The library now accepts a required `date` property instead of `children`: `<ReactTimeAgo date={date}/>` instead of `<ReactTimeAgo>{date}</ReactTimeAgo>`.

3.0.0 / 30.07.2018
===================

  * (breaking change) `Tooltip` component updated to `react-responsive-ui@0.14` which requires React >= 16.

2.0.0 / 30.03.2018
===================

  * Removed `this.context` from code (was used to get `react-intl` locale) to support React >= 17.
  <!-- * (breaking change) Removed `babel-runtime` dependency: now requires ES6 polyfill for `Set`. E.g. use `babel-polyfill` or `core-js/fn/set`. -->

1.0.7 / 11.01.2018
===================

  * The default export is now `<WithTooltip/>` instead of bare `<ReactTimeAgo/>`.
  * `{ WithTooltip }` export is no longer avaible. The bare version of `<ReactTimeAgo/>` is being exported as `{ TimeAgo }`.

1.0.0 / 09.01.2018
===================

  * (breaking change) Updated to `javascript-time-ago@1.0.0`. Some properties got renamed.

0.5.0 / 08.01.2018
===================

  * (breaking change) dropped `intl-messageformat` and implemented the functionality in `javascript-time-ago@0.5.0` instead (is better)

0.4.0 / 08.01.2018
===================

  * (breaking change) `wrapper` property renamed to `container`
  * (breaking change) `container` `verbose` property renamed to `verboseDate`
  * (breaking change) Removed old deprecated underscored property names
  * Overall cleaning and a bit of refactoring

0.3.2 / 22.12.2016
===================

  * Added a camelCase alias for `time_style` (it's now also `timeStyle`)
  * Added dummy tests

0.3.1 / 01.10.2016
===================

  * Added an exported class `new Date_time_formatter(locale)` for plain-text full date formatting
  * Added an exported class `new Time_ago(locale)` for plain-text relative date formatting

0.3.0 / 01.10.2016
===================

  * Removed `date` and `time` properties and resorted to React `children` instead

0.2.4 / 20.09.2016
===================

  * Added a `wrapper` property (for custom tooltip)

0.2.3 / 05.09.2016
===================

  * Fixed `this._components.remove is not a function` error

0.2.0 / 15.08.2016
===================

  * Renamed `css_style` to `style` and `style` to `time_style`

0.1.x / 13.04.2016
===================

  * Moved `intl-messageformat` to `peerDependencies`

0.1.0 / 03.04.2016
===================

  * Initial release