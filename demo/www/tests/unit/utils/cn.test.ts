import { expect, test, describe } from 'bun:test'
import { cn } from '../../../src/lib/utils'

describe('cn', () => {
  test('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  test('should handle conditional classes', () => {
    expect(cn('base', { 'conditional-class': true })).toBe(
      'base conditional-class'
    )
    expect(cn('base', { 'conditional-class': false })).toBe('base')
  })

  test('should override conflicting classes with tailwind-merge', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  test('should handle a mix of string and object arguments', () => {
    expect(cn('base', { 'conditional-class': true }, 'another-class')).toBe(
      'base conditional-class another-class'
    )
  })

  test('should return an empty string if no arguments are provided', () => {
    expect(cn()).toBe('')
  })
})
