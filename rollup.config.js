import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import rollupTS from "rollup-plugin-typescript2";

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react/jsx-runtime": "jsxRuntime",
};

export default {
  input: "src/index.tsx",
  output: [
    {
      format: "cjs",
      dir: "dist/cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      format: "esm",
      exports: "named",
      dir: "dist/es",
      sourcemap: true,
    },
    {
      format: "umd",
      exports: "named",
      dir: "dist/umd",
      sourcemap: true,
      name: "ReactSpringCarousel",
      globals,
    },
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"],
    }),
    rollupTS(),
    external(),
    resolve(),
  ],
};
