import { Paginators, sortFields, PaginatorResponse } from './paginator';

describe('Paginator Utils', () => {
  describe('Paginators', () => {
    it('should return default values when no params provided', () => {
      const result = Paginators({});

      expect(result).toEqual({
        start: undefined,
        size: undefined,
        skip: 0,
        limit: 10,
        sorts: { createdAt: -1 },
        sort_by: undefined,
      });
    });

    it('should handle valid pagination parameters', () => {
      const result = Paginators({
        start: 20,
        size: 15,
        sort_by: 'name,-createdAt',
      });

      expect(result).toEqual({
        start: 20,
        size: 15,
        skip: 20,
        limit: 15,
        sorts: { name: 1, createdAt: -1 },
        sort_by: 'name,-createdAt',
      });
    });

    it('should handle string numbers correctly', () => {
      const result = Paginators({
        start: '10' as unknown as number,
        size: '25' as unknown as number,
      });

      expect(result.skip).toBe(10);
      expect(result.limit).toBe(25);
    });

    it('should default to 0 for negative or invalid size', () => {
      const result1 = Paginators({ size: -5 });
      const result2 = Paginators({ size: NaN });

      expect(result1.limit).toBe(0);
      expect(result2.limit).toBe(10); // NaN defaults to 10
    });

    it('should handle invalid start values', () => {
      const result = Paginators({
        start: 'invalid' as unknown as number,
      });

      expect(result.skip).toBe(0);
    });
  });

  describe('sortFields', () => {
    it('should return default sort when no string provided', () => {
      const result1 = sortFields();
      const result2 = sortFields('');
      const result3 = sortFields(undefined);

      expect(result1).toEqual({ createdAt: -1 });
      expect(result2).toEqual({ createdAt: -1 });
      expect(result3).toEqual({ createdAt: -1 });
    });

    it('should handle single field without sign (default ascending)', () => {
      const result = sortFields('name');

      expect(result).toEqual({ name: 1 });
    });

    it('should handle single field with descending sign', () => {
      const result = sortFields('-name');

      expect(result).toEqual({ name: -1 });
    });

    it('should handle single field with ascending sign', () => {
      const result = sortFields('+name');

      expect(result).toEqual({ name: 1 });
    });

    it('should handle multiple fields with mixed signs', () => {
      const result = sortFields('name,-createdAt,+email,age');

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
        email: 1,
        age: 1,
      });
    });

    it('should handle fields with spaces and empty values', () => {
      const result = sortFields(' name , -createdAt ,  , +email ');

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
        email: 1,
      });
    });

    it('should handle complex field names', () => {
      const result = sortFields('-user.profile.name,+booking.createdAt');

      expect(result).toEqual({
        'user.profile.name': -1,
        'booking.createdAt': 1,
      });
    });

    it('should filter out empty or invalid fields', () => {
      const result = sortFields('name,,,-createdAt, , +');

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
      });
    });
  });

  describe('PaginatorResponse', () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];

    it('should return proper response structure with default values', () => {
      const result = PaginatorResponse();

      expect(result).toEqual({
        results: [],
        total: 0,
        start: 0,
        end: 0,
        size: 10,
      });
    });

    it('should calculate end correctly based on data length', () => {
      const result = PaginatorResponse(mockData, 100, 10, 20);

      expect(result).toEqual({
        results: mockData,
        total: 100,
        start: 20,
        end: 23, // 20 + 3 (data length)
        size: 10,
      });
    });

    it('should handle first page correctly', () => {
      const result = PaginatorResponse(mockData, 50, 10, 0);

      expect(result).toEqual({
        results: mockData,
        total: 50,
        start: 0,
        end: 3,
        size: 10,
      });
    });

    it('should handle empty results', () => {
      const result = PaginatorResponse([], 0, 10, 0);

      expect(result).toEqual({
        results: [],
        total: 0,
        start: 0,
        end: 0,
        size: 10,
      });
    });

    it('should handle NaN size', () => {
      const result = Paginators({ size: NaN });

      expect(result?.limit).toEqual(10);
    });

    it('should handle string size', () => {
      const result = Paginators({ size: 'name' as unknown as number });

      expect(result?.limit).toEqual(10);
    });

    it('should handle large datasets', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
      const result = PaginatorResponse(largeData, 1000, 100, 200);

      expect(result).toEqual({
        results: largeData,
        total: 1000,
        start: 200,
        end: 300,
        size: 100,
      });
    });

    it('should handle partial pages', () => {
      const partialData = [mockData[0], mockData[1]];
      const result = PaginatorResponse(partialData, 100, 10, 90);

      expect(result).toEqual({
        results: partialData,
        total: 100,
        start: 90,
        end: 92,
        size: 10,
      });
    });
  });
});
