import React from 'react'
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

const Container = ({ verboseDate, children }) => (
	<Tooltip text={verboseDate}>
		{children}
	</Tooltip>
)