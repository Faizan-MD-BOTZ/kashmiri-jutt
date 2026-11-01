import test from 'node:test';
import assert from 'node:assert/strict';
import { SERVERS } from '../src/servers.mjs';
import {
  buildPairCodeUrl,
  extractPairCode,
  isValidPhoneNumber,
  normalizeBaseUrl,
  normalizePhoneNumber,
  selectHealthyServer
} from '../src/pairing-core.mjs';

test('normalizes formatted phone numbers to digits', () => {
  assert.equal(normalizePhoneNumber('+92 300-123 4567'), '923001234567');
});

test('accepts only 10 to 15 digits including country code', () => {
  assert.equal(isValidPhoneNumber('923001234567'), true);
  assert.equal(isValidPhoneNumber('123456789'), false);
  assert.equal(isValidPhoneNumber('1234567890123456'), false);
});

test('only accepts HTTPS server base URLs without embedded credentials', () => {
  assert.equal(normalizeBaseUrl('https://example.herokuapp.com/'), 'https://example.herokuapp.com');
  assert.equal(normalizeBaseUrl('http://example.herokuapp.com/'), '');
  assert.equal(normalizeBaseUrl('https://user:pass@example.herokuapp.com/'), '');
  assert.equal(normalizeBaseUrl('not-a-url'), '');
});

test('builds the exact /code?number= API request URL', () => {
  assert.equal(
    buildPairCodeUrl('https://example.herokuapp.com/', '+92 300 1234567'),
    'https://example.herokuapp.com/code?number=923001234567'
  );
});

test('Auto Server chooses only a healthy server and returns null if none are healthy', () => {
  const healthy = { id: 'server-2', online: true };
  const chosen = selectHealthyServer([{ id: 'server-1', online: false }, healthy], () => 0.9);
  assert.equal(chosen, healthy);
  assert.equal(selectHealthyServer([{ id: 'server-1', online: false }]), null);
});

test('reads only a non-empty string pairing code', () => {
  assert.equal(extractPairCode({ code: '  AB12-CD34  ' }), 'AB12-CD34');
  assert.equal(extractPairCode({ error: 'Number required' }), '');
  assert.equal(extractPairCode({ code: 12345 }), '');
});

test('configures five unique existing server endpoints and leaves slots six and seven empty', () => {
  assert.equal(SERVERS.length, 7);
  const expected = [
    'https://freebot07-d877ac2d7885.herokuapp.com/',
    'https://web-production-461bb3.up.railway.app/',
    'https://fazi007-f531d4510b01.herokuapp.com/',
    'https://fazi008-d3fb7605adb5.herokuapp.com/',
    'https://fazi009-9d9a2a67162e.herokuapp.com/',
    '',
    ''
  ];
  assert.deepEqual(SERVERS.map(server => server.baseUrl), expected);
  assert.equal(new Set(expected.filter(Boolean)).size, 5);
});
