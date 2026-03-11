import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "lib/index.cjs",
      format: "cjs",
      exports: "auto",
    },
    {
      file: "lib/index.mjs",
      format: "es",
    },
  ],
  plugins: [
    typescript({
      removeComments: true,
      tsconfig: "./tsconfig.rollup.json",
    }),
    nodeResolve(),
    terser(),
  ],
}
