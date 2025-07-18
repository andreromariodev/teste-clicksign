// Setup básico para testes
beforeAll(async () => {
  // Setup inicial se necessário
});

afterAll(async () => {
  // Cleanup final se necessário
});

beforeEach(async () => {
  // Cleanup antes de cada teste
});

// Mock do console para testes mais limpos
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
