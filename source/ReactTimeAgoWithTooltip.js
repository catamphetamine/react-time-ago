import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from './ReactTimeAgo'

// Could have been `import { Tooltip } from 'react-responsive-ui'`
// but in that case Webpack bundles the whole `react-responsive-ui` package.
import Tooltip from 'react-responsive-ui/commonjs/Tooltip'

export default function ReactTimeAgoWithTooltip(props) {
	return (
		<ReactTimeAgo
			{...props}
			container={ReactTimeAgoContainer}
			tooltip={false}/>
	)
}

const ReactTimeAgoContainer = ({ verboseDate, children, ...rest }) => (
	<Tooltip content={verboseDate} {...rest}>
		{children}
	</Tooltip>
)

ReactTimeAgoContainer.propTypes = {
	verboseDate : PropTypes.string
}