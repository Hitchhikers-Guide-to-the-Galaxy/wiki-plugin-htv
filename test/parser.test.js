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

test('parses the nova mode and rejects unknown modes', () => {
  assert.equal(parseText('MODE NOVA').mode, 'nova')
  assert.equal(parseText('MODE DISCO').mode, 'swarm')
})

test('parses and sanitises the room name', () => {
  assert.equal(parseText('ROOM greenroom').room, 'greenroom')
  assert.equal(parseText('ROOM green room!').room, 'green_room_')
  assert.equal(parseText('TITLE No Room Here').room, '')
})
