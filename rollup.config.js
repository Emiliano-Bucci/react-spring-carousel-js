import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import rollupTS from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import size from 'rollup-plugin-filesize'
import visualizer from 'rollup-plugin-visualizer'

const plugins = [
  rollupTS({
    tsconfigOverride: {
      exclude: ['Examples', 'node_modules'],
    },
  }),
  babel({
    exclude: 'node_modules/**',
    presets: ['@babel/preset-react'],
  }),
  external(),
  resolve(),
  commonjs(),
  terser(),
  size(),
  visualizer({
    filename: 'stats-react.json',
    json: true,
  }),
]

export default [
  {
    input: 'src/carouselTypes/useSpringCarousel.tsx',
    output: [
      {
        format: 'cjs',
        exports: 'named',
        dir: 'dist/',
        sourcemap: true,
        name: 'ReactSpringCarousel',
      },
    ],
    plugins,
  },
  {
    input: 'src/carouselTypes/useTransitionCarousel.tsx',
    output: [
      {
        format: 'cjs',
        exports: 'named',
        dir: 'dist/',
        sourcemap: true,
        name: 'ReactSpringCarousel',
      },
    ],
    plugins,
  },
]
