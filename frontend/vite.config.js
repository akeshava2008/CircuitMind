import { defineConfig } from 'vite';
export default defineConfig({build: {
  lib: {entry: 'src/component.js', formats: ['es'], fileName: () => 'chabi.js'},
  rolldownOptions: {output: {codeSplitting: false}},
  minify: true, sourcemap: false,
}});
