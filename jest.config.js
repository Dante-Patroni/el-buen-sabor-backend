module.exports = {
  testEnvironment: 'node',
  
  // Ignorar carpetas que no queremos testear
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/migrations/',
    '/seeders/',
    '/tests/',
    '/uploads/'
  ],
  
  // Dónde buscar los tests
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  
  // De qué archivos queremos medir cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/models/index.js',
    '!src/docs/**',
    '!src/config/**'
  ],
  
  // Formato del reporte
  coverageReporters: [
    'text',        // En la consola
    'text-summary', // Resumen
    'html',        // Reporte HTML en coverage/
    'lcov'         // Para herramientas de CI/CD
  ],
  
  // Umbrales mínimos (opcional)
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50
    }
  }
};
