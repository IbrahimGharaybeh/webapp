import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.js'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'functions/**/*.js',
        'lib/**/*.js',
        'middleware/**/*.js',
        'routes/**/*.js',
        'utils/**/*.js'
      ],
      exclude: ['test/**']
    }
  }
});
