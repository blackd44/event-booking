import { errorMessage } from './error';

describe('errorMessage', () => {
  it('should return the message from Error objects', () => {
    const error = new Error('Something went wrong');
    const result = errorMessage(error);

    expect(result).toBe('Something went wrong');
  });

  it('should return the message from objects with message property', () => {
    const error = { message: 'Custom error message' };
    const result = errorMessage(error);

    expect(result).toBe('Custom error message');
  });

  it('should return default error message for null', () => {
    const result = errorMessage(null);

    expect(result).toBe('Unknown error');
  });

  it('should return default error message for undefined', () => {
    const result = errorMessage(undefined);

    expect(result).toBe('Unknown error');
  });

  it('should return default error message for string without message property', () => {
    const result = errorMessage('string error');

    expect(result).toBe('Unknown error');
  });

  it('should return default error message for number', () => {
    const result = errorMessage(123);

    expect(result).toBe('Unknown error');
  });

  it('should return default error message for boolean', () => {
    const result = errorMessage(true);

    expect(result).toBe('Unknown error');
  });

  it('should return custom default error message', () => {
    const error = 'not an error object';
    const result = errorMessage(error, 'Custom default message');

    expect(result).toBe('Custom default message');
  });

  it('should handle objects without message property', () => {
    const error = { code: 500, status: 'error' };
    const result = errorMessage(error);

    expect(result).toBe('Unknown error');
  });

  it('should handle nested error objects', () => {
    const error = {
      message: 'Database connection failed',
      code: 'DB_ERROR',
      details: 'Connection timeout',
    };
    const result = errorMessage(error);

    expect(result).toBe('Database connection failed');
  });

  it('should handle TypeError objects', () => {
    const error = new TypeError('Type mismatch');
    const result = errorMessage(error);

    expect(result).toBe('Type mismatch');
  });

  it('should handle ReferenceError objects', () => {
    const error = new ReferenceError('Variable not defined');
    const result = errorMessage(error);

    expect(result).toBe('Variable not defined');
  });

  it('should handle objects with empty message', () => {
    const error = { message: '' };
    const result = errorMessage(error);

    expect(result).toBe('');
  });

  it('should handle objects with empty message', () => {
    const error = {};
    const result = errorMessage(error, 'Custom default message');

    expect(result).toBe('Custom default message');
  });

  it('should handle objects with non-string message', () => {
    const error = { message: 123 };
    const result = errorMessage(error);

    expect(result).toBe('123');
  });

  it('should use custom default when error has no message property', () => {
    const error = { code: 404 };
    const result = errorMessage(error, 'Resource not found');

    expect(result).toBe('Resource not found');
  });
});
