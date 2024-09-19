<<<<<<< HEAD
=======

>>>>>>> 007855d (chore: vitest setup)
import swc from 'unplugin-swc'
import * as tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [swc.vite(), tsconfigPaths.default()],
<<<<<<< HEAD
})
=======
})
>>>>>>> 007855d (chore: vitest setup)
