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

test('parses ui modes and defaults to studio', () => {
  assert.equal(parseText('UI JOIN').ui, 'join')
  assert.equal(parseText('UI watch').ui, 'watch')
  assert.equal(parseText('UI KIOSK').ui, 'studio')
  assert.equal(parseText('TITLE Plain').ui, 'studio')
})

test('parses a stream url', () => {
  assert.equal(parseText('STREAM https://youtube.com/live/abc123').stream, 'https://youtube.com/live/abc123')
  assert.equal(parseText('TITLE No Stream').stream, '')
})

test('parses the video mode', () => {
  assert.equal(parseText('MODE VIDEO').mode, 'video')
  assert.equal(parseText('MODE video').mode, 'video')
})

test('parses jellyfin item fields and strips a trailing slash', () => {
  const p = parseText('MODE video\nJELLYFIN http://pi5.local:4284/\nITEM cf9d8c95\nKEY abc123')
  assert.equal(p.jellyfin, 'http://pi5.local:4284')
  assert.equal(p.item, 'cf9d8c95')
  assert.equal(p.key, 'abc123')
})

test('jellyfin fields default empty', () => {
  const p = parseText('TITLE Nothing')
  assert.equal(p.jellyfin, '')
  assert.equal(p.item, '')
  assert.equal(p.key, '')
})
