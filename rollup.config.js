import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/kayf-ui.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/kayf-ui.cjs.js', format: 'cjs', sourcemap: true },
    { file: 'dist/kayf-ui.umd.js', format: 'umd', name: 'KayfUI', sourcemap: true },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
}
