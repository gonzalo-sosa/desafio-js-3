import { createHash } from 'crypto';

export function createUUID() {
  return createHash('sha256').update(new Date().toISOString()).digest('hex');
}
