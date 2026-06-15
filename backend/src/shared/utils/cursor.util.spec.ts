import { BadRequestException } from '@nestjs/common';
import {
  encodeCursor,
  decodeCursor,
  encodeTimestampCursor,
  decodeTimestampCursor,
  buildForwardTimestampWhere,
} from '@/shared/utils/cursor.util';

describe('cursor.util', () => {
  describe('numeric cursor', () => {
    it('encodes and decodes id', () => {
      const encoded = encodeCursor(42);
      expect(decodeCursor(encoded)).toBe(42);
    });

    it('throws on invalid cursor', () => {
      expect(() => decodeCursor('invalid')).toThrow(BadRequestException);
    });
  });

  describe('timestamp cursor', () => {
    it('encodes and decodes composite cursor', () => {
      const data = {
        createdAt: '2024-05-05T19:28:13.531Z',
        id: 'clxyz123',
      };
      const encoded = encodeTimestampCursor(data);
      expect(decodeTimestampCursor(encoded)).toEqual(data);
    });

    it('builds forward where clause', () => {
      const where = buildForwardTimestampWhere({
        createdAt: '2024-05-05T19:28:13.531Z',
        id: 'abc',
      });
      expect(where).toHaveProperty('OR');
    });
  });
});
