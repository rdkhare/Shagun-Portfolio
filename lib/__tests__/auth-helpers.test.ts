import { describe, it, expect, vi, beforeEach } from 'vitest'

// Test the email parsing logic that getAuthorizedEmails uses
// (the function is not exported, so we test the pattern directly)
function parseAuthorizedEmails(emailsString: string | undefined): string[] {
  if (!emailsString) return []
  return emailsString
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0)
}

describe('parseAuthorizedEmails', () => {
  it('returns empty array when input is undefined', () => {
    expect(parseAuthorizedEmails(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(parseAuthorizedEmails('')).toEqual([])
  })

  it('parses single email', () => {
    expect(parseAuthorizedEmails('admin@example.com')).toEqual(['admin@example.com'])
  })

  it('parses comma-separated emails', () => {
    expect(parseAuthorizedEmails('a@example.com,b@example.com')).toEqual([
      'a@example.com',
      'b@example.com',
    ])
  })

  it('trims whitespace around emails', () => {
    expect(parseAuthorizedEmails('  a@example.com , b@example.com  ')).toEqual([
      'a@example.com',
      'b@example.com',
    ])
  })

  it('filters out empty entries from trailing commas', () => {
    expect(parseAuthorizedEmails('a@example.com,,b@example.com,')).toEqual([
      'a@example.com',
      'b@example.com',
    ])
  })
})
