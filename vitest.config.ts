import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**\/tests\/*.test.ts'],
    environment: 'happy-dom',
    server: {
      deps: {
        inline: ['ol-osmoverpass']
      }
    }
  }
});
