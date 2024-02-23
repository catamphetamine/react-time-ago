import * as React from 'react';

import { Style } from 'javascript-time-ago';

export { Style } from 'javascript-time-ago';

interface UpdateIntervalForStep {
	threshold?: number;
	interval: number;
}

interface TimeAgoParameters {
	date: Date | number;
	future?: boolean;
	locale?: string;
	locales?: string[];
	timeStyle?: string | Style;
	round?: string;
	minTimeLeft?: number;
	formatVerboseDate?: (date: Date) => string;
	verboseDateFormat?: object;
	updateInterval?: number | UpdateIntervalForStep[];
	tick?: boolean;
	now?: number;
	timeOffset?: number;
	polyfill?: boolean;
}

interface Props extends React.HTMLAttributes<HTMLElement>, TimeAgoParameters {
	tooltip?: boolean;
	component?: React.ElementType;
	wrapperComponent?: React.ElementType;
	wrapperProps?: object;
	// Any other properties are passed through to the `<time/>` element.
	[otherProperty: string]: any;
}

// React TypeScript Cheatsheet doesn't recommend using `React.FunctionalComponent`.
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components
// declare const ReactTimeAgo: React.FC<Props>;

type ReactTimeAgoComponent = (props: Props) => JSX.Element;

declare const ReactTimeAgo: ReactTimeAgoComponent;

export default ReactTimeAgo;

interface TimeAgoResult {
	date: Date;
	verboseDate: string;
	formattedDate: string;
}

export function useTimeAgo(parameters: TimeAgoParameters): TimeAgoResult;
