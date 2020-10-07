// import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'

const resolveModules = resolve({})

export default [
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
        'javascript-time-ago': 'javascript-time-ago'
      }
    }
  }
]