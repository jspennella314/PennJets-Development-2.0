// The site's test runner. WO-4.41.
//
//   npm test            (vitest run; CI runs it before the build, deploy.yml)
//   npx vitest          (watch mode, locally)
//
// Files are *.test.js / *.test.jsx beside the module they test. The default
// environment is node, which is what siteMeta.js and blogPaging.js need; a
// component test that needs a DOM says so at the top of its file:
//
//   // @vitest-environment happy-dom
//
// Explicit imports from 'vitest' in every test file, no globals: the CRM's
// convention (WO-3.34), and what keeps eslint's config untouched.
//
// vitest 3 carries its own vite 7 for the tests; the site itself still builds
// with vite 4 (package.json). @vitejs/plugin-react works with both.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
    // One process, like the build: the suite is small, and happy-dom plus
    // DOMPurify in a forked worker is the thing most likely to differ from
    // the browser the prerender uses, so keep the surface simple.
    pool: 'forks',
    reporters: 'verbose',
  },
});
