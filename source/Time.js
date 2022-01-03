import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

export default function Time({
	date,
	verboseDate,
	tooltip,
	children,
	...rest
}, ref) {
	const isoString = useMemo(() => date.toISOString(), [date])
	return (
		<time
			ref={ref}
			{...rest}
			dateTime={isoString}
			title={tooltip ? verboseDate : undefined}>
			{children}
		</time>
	)
}

// https://gitlab.com/catamphetamine/react-time-ago/-/issues/5
//
// Someone used this component with "Material UI"'s `<Tooltip/>` component,
// and that component required `children` be `ref`-able.
// https://github.com/mui-org/material-ui/blob/a9903917f919092f80d84075f39fb51d51f241f2/packages/mui-material/src/Tooltip/Tooltip.js#L494-L496
// 
// That component seems to only be using that `ref-`ability to check whether 
// the `children` element qualifies for `:focus-visible` selector.
// https://github.com/mui-org/material-ui/blob/a9903917f919092f80d84075f39fb51d51f241f2/packages/mui-utils/src/useIsFocusVisible.ts#L105
//
Time = React.forwardRef(Time)

Time.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
	verboseDate: PropTypes.string,
	tooltip: PropTypes.bool.isRequired,
	children: PropTypes.string.isRequired
}