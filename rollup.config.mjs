import typescript from "rollup-plugin-typescript2"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

export default {
  input: "./src/index.ts",
  output: {
    file: "lib/index.js",
    format: "cjs",
    exports: "auto",
  },
  plugins: [
    typescript({
      direction: true,
      removeComments: true,
      // 使用声明生成路径配置
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve(),
    terser()
  ],
}
