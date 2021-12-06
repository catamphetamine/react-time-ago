// import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'

const resolveModules = resolve({})

export default [
  // (deprecated)
  // Old bundle: old file name (with ".min")
  // and uses `window['javascript-time-ago'].default` variable.
  {
    input: 'modules/ReactTimeAgo.js',
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
      exports: 'default',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes',
        'javascript-time-ago': 'JavascriptTimeAgo'
      }
    }
  },
  // New bundle: new file name (without ".min")
  // and uses `TimeAgo` global variable.
  {
    input: 'modules/ReactTimeAgo.js',
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
      file: 'bundle/react-time-ago.js',
      sourcemap: true,
      exports: 'default',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes',
        'javascript-time-ago': 'TimeAgo'
      }
    }
  }
]