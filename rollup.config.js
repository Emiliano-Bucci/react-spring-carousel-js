import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import rollupTS from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
}

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'cjs',
      dir: 'dist/cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      format: 'esm',
      exports: 'named',
      dir: 'dist/es',
      sourcemap: true,
    },
    {
      format: 'umd',
      exports: 'named',
      dir: 'dist/umd',
      sourcemap: true,
      name: 'ReactSpringCarousel',
      globals,
    },
  ],
  plugins: [
    rollupTS({
      tsconfigOverride: {
        exclude: [
          'node_modules',
          'src/**/*.test.tsx',
          'src/**/*.stories.tsx',
        ],
      },
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
    }),
    external(),
    resolve(),
    terser(),
  ],
}
