import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import rollupTS from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'
import size from 'rollup-plugin-filesize'

// const globals = {
//   react: 'React',
//   'react-dom': 'ReactDOM',
//   'react/jsx-runtime': 'jsxRuntime',
//   'react-spring': 'reactSpring',
//   'react-use-gesture': 'reactUseGesture',
//   rxjs: 'rxjs',
//   screenfull: 'screenfull',
// }

export default [
  {
    input: 'src/useSpringCarousel.tsx',
    output: [
      {
        format: 'cjs',
        exports: 'named',
        dir: 'dist/',
        sourcemap: true,
        name: 'ReactSpringCarousel',
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
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
    ],
  },
  {
    input: 'src/useTransitionCarousel.tsx',
    output: [
      {
        format: 'cjs',
        exports: 'named',
        dir: 'dist/',
        sourcemap: true,
        name: 'ReactSpringCarousel',
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
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
    ],
  },
]

// export default {
//   input: 'src/index.tsx',
//   output: [
//     {
//       file: pkg.main,
//       format: 'umd',
//       exports: 'named',
//       sourcemap: true,
//       name: 'ReactSpringCarousel',
//       globals,
//     },
//     {
//       file: pkg.module,
//       format: 'es',
//       sourcemap: true,
//       name: 'ReactSpringCarousel',
//       globals,
//     },
//   ],
//   external: [
//     ...Object.keys(pkg.dependencies || {}),
//     ...Object.keys(pkg.peerDependencies || {}),
//   ],
//   plugins: [
//     rollupTS({
//       tsconfigOverride: {
//         exclude: ['Examples', 'node_modules'],
//       },
//     }),
//     babel({
//       exclude: 'node_modules/**',
//       presets: ['@babel/preset-react'],
//     }),
//     external(),
//     resolve(),
//     commonjs(),
//     terser(),
//     size(),
//   ],
// }
