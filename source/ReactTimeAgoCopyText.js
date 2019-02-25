import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from './ReactTimeAgo'

export default function ReactTimeAgoCopyText(props) {
	return (
		<ReactTimeAgo
			{...props}
			container={ReactTimeAgoContainer}/>
	)
}

// Relative date is displayed but is not selectable because it 
// doesn't have any value due to being inherently transient.
const ReactTimeAgoContainer = ({ verboseDate, children, ...rest }) => (
	<span {...rest}>
		<span style={VERBOSE_DATE_STYLE}>
			{verboseDate}
		</span>
		{children}
	</span>
)

ReactTimeAgoContainer.propTypes = {
	verboseDate : PropTypes.string
}

// Verbose date is not displayed but is selectable for copy-pasting.
const VERBOSE_DATE_STYLE = {
	fontSize: 0
}

// // https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting
// const RELATIVE_DATE_STYLE = {
// 	// For Chrome, Opera.
// 	userSelect: 'none',
// 	// For Konqueror.
// 	'-khtml-user-select': 'none',
// 	// For Safari.
// 	'-webkit-user-select': 'none',
// 	// For iOS Safari.
// 	'-webkit-touch-callout': 'none',
// 	// For Firefox.
// 	'-moz-user-select': 'none',
// 	// For IE 10 and 11, Edge.
// 	'-ms-user-select': 'none'
// }