import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

const targets = [
  "last 2 chrome versions",
  "last 2 firefox versions",
  "last 2 safari versions",
]

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    external: ["cross-fetch", "qs", "node-rsa"],
    plugins: [typescript()],
  },
  {
    input: "src/client.ts",
    output: {
      file: "umd/saltedge-api.js",
      name: "SaltEdge",
      format: "umd",
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      typescript(),
      nodeResolve({ browser: true }),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        extensions: [".js", ".ts"],
        presets: [
          [
            "@babel/preset-env",
            {
              targets,
              useBuiltIns: false,
            },
          ],
        ],
      }),
    ],
  },
  {
    input: "src/client.ts",
    output: {
      file: "umd/saltedge-api.min.js",
      name: "SaltEdge",
      format: "umd",
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      typescript(),
      nodeResolve({ browser: true }),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        extensions: [".js", ".ts"],
        presets: [
          [
            "@babel/preset-env",
            {
              targets,
              useBuiltIns: false,
            },
          ],
        ],
      }),
      terser(),
    ],
  },
]
