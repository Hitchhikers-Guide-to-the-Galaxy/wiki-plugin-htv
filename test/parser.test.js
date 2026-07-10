import test from 'node:test'
import assert from 'node:assert/strict'
import { parseText } from '../src/client/htv.js'

test('parses uppercase htv commands', () => {
  const parsed = parseText('MODE SHATTER\nHEIGHT 640\nVDO https://vdo.ninja/?view=test')
  assert.equal(parsed.mode, 'shatter')
  assert.equal(parsed.height, 640)
  assert.equal(parsed.vdo, 'https://vdo.ninja/?view=test')
})

test('accepts optional colon form', () => {
  const parsed = parseText('MODE: PORTAL\nHEIGHT: 500')
  assert.equal(parsed.mode, 'portal')
  assert.equal(parsed.height, 500)
})
