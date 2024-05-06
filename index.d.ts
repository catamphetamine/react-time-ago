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

interface Props extends TimeAgoParameters {
	tooltip?: boolean;
	component?: React.ElementType;
	wrapperComponent?: React.ElementType;
	wrapperProps?: object;
}

declare const ReactTimeAgo: React.ForwardRefExoticComponent<Props & React.AllHTMLAttributes<HTMLTimeElement> & React.RefAttributes<HTMLTimeElement>>;

export default ReactTimeAgo;

interface TimeAgoResult {
	date: Date;
	verboseDate: string;
	formattedDate: string;
}

export function useTimeAgo(parameters: TimeAgoParameters): TimeAgoResult;
