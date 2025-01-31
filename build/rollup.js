// ------------------------------------------------------------------------------------------
// setup
// ------------------------------------------------------------------------------------------

import path from 'path'
import license from 'rollup-plugin-license'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'

const pkg = require('../package.json')
const external = Object.keys(pkg.dependencies || {})
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())
const treeshake = false

function output (ext, format = 'umd') {
  return {
    name: className,
    file: `dist/${name}.${ext}`,
    format: format,
    treeshake: treeshake,
    exports: 'named',
  }
}

// ------------------------------------------------------------------------------------------
// build
// ------------------------------------------------------------------------------------------

const umd = {
  input: 'src/main.js',
  external: external,
  output: output('js'),
  treeshake: treeshake,
  plugins: [
    license({
      banner: {
        file: path.join(__dirname, 'banner.txt')
      },
    }),
    commonjs(),
    buble()
  ]
}

const min = Object.assign({}, umd, {
  output: output('min.js'),
  treeshake: treeshake,
  plugins: [...umd.plugins, uglify()]
})

const es = Object.assign({}, umd, {
  treeshake: treeshake,
  output: output('esm.js', 'es')
})

export default [umd, min, es]
