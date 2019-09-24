// import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'

const resolveModules = resolve({
  // only: [
  //   'javascript-time-ago'
  // ]
})

export default [
  {
    input: 'index.js',
    plugins: [
      resolveModules,
      commonjs(),
      // json(),
      terser(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
    external: [
      'react',
      'prop-types',
      'javascript-time-ago'
    ],
    output: {
      format: 'umd',
      name: 'ReactTimeAgo',
      file: 'bundle/react-time-ago.min.js',
      sourcemap: true,
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes',
        'javascript-time-ago': 'javascript-time-ago'
      }
    }
  },
  {
    input: 'tooltip/index.js',
    plugins: [
      resolveModules,
      commonjs(),
      // json(),
      terser(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
    external: [
      'react',
      'prop-types',
      'javascript-time-ago'
    ],
    output: {
      format: 'umd',
      name: 'ReactTimeAgo',
      file: 'bundle/react-time-ago.tooltip.min.js',
      sourcemap: true,
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes',
        'javascript-time-ago': 'javascript-time-ago'
      }
    }
  }
]