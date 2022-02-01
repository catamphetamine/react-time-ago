import * as React from 'react';

import { Style } from 'javascript-time-ago';

export { Style } from 'javascript-time-ago';

interface UpdateIntervalForStep {
	threshold?: number;
	interval: number;
}

interface Props extends React.HTMLAttributes<HTMLElement> {
	date: Date | number;
	future?: boolean;
	timeStyle?: string | Style;
	round?: string;
	minTimeLeft?: number;
	tooltip?: boolean;
	component?: React.ReactType;
	wrapperComponent?: React.ReactType;
	wrapperProps?: object;
	locale?: string;
	locales?: string[];
	formatVerboseDate?: (date: Date) => string;
	verboseDateFormat?: object;
	updateInterval?: number | UpdateIntervalForStep[];
	tick?: boolean;
	now?: number;
	timeOffset?: number;
	polyfill?: boolean;
	// All other properties are passed through to the `<time/>` element.
	[otherProperty: string]: any;
}

// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components
// declare const ReactTimeAgo: React.FC<Props>;

type ReactTimeAgoComponent = (props: Props) => JSX.Element;

declare const ReactTimeAgo: ReactTimeAgoComponent;

export default ReactTimeAgo;