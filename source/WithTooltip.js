import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from './ReactTimeAgo'

// Could have been `import { Tooltip } from 'react-responsive-ui'`
// but in that case Webpack bundles the whole `react-responsive-ui` package.
import Tooltip from 'react-responsive-ui/commonjs/Tooltip'

export default function TimeAgo(props) {
	return (
		<ReactTimeAgo
			{...props}
			container={Container}
			tooltip={false}/>
	)
}

const Container = ({ verboseDate, children, ...rest }) => (
	<Tooltip content={verboseDate} {...rest}>
		{children}
	</Tooltip>
)

Container.propTypes =
{
	verboseDate : PropTypes.string
}