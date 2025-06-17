import { describe, it, expect } from 'vitest'
import {
  fillFormData,
  formatTime,
  handleProfilePicture,
  getAnimatedEmoji,
  getNormalEmoji,
  emojis,
} from '@/utils/helper'

describe('fillFormData', () => {
  it('should populate FormData with correct info', () => {
    const payload = {
      firstname: 'John',
      lastname: 'Doe',
      functionTitle: 'Developer',
      bio: 'Experienced developer',
      age: 30,
      profilePicture: new File([''], 'profile.png'),
      profilePictureLink: 'http://example.com/pic',
      yearsOfExperience: '10',
      company: {
        name: 'Tech Co.',
        street: 'Main Street',
        houseNumber: '123',
        city: 'Tech City',
        postalcode: '1000',
      },
      specialitiesJson: {
        Known: [{ Name: 'JavaScript', Category: 2 }],
        Needed: [{ Name: 'TypeScript', Category: 1 }],
      },
      color: '#FF5733',
    }

    const formData = fillFormData(payload)

    expect(formData.get('Firstname')).toBe('John')
    expect(formData.get('Lastname')).toBe('Doe')
    expect(formData.get('Bio')).toBe('Experienced developer')
    expect(formData.get('Age')).toBe('30')
    expect(formData.get('FunctionTitle')).toBe('Developer')
    expect(formData.get('Experience')).toBe('10')
    expect(formData.get('Company[Name]')).toBe('Tech Co.')
    expect(formData.get('Company[City]')).toBe('Tech City')
    expect(formData.get('SpecialitiesJson')).toBe(
      JSON.stringify({
        Known: [{ Name: 'JavaScript', Category: 2 }],
        Needed: [{ Name: 'TypeScript', Category: 1 }],
      }),
    )
    expect(formData.get('Color')).toBe('#FF5733')
    expect(formData.get('profilePictureLink')).toBe('http://example.com/pic')
  })
})

describe('formatTime', () => {
  it('should format time correctly for today', () => {
    const today = new Date()
    const formattedTime = formatTime(today)

    expect(formattedTime).toMatch(/^\d{2}:\d{2}$/) // hh:mm
  })

  it('should format dates for other days', () => {
    const date = new Date('2023-01-01')
    const formattedTime = formatTime(date)

    expect(formattedTime).toBe('zo') // Expect 'zo' for zondag in nl-BE locale
  })

  it('should return "Ongeldige datum" for invalid dates', () => {
    const formattedTime = formatTime('invalid-date')
    expect(formattedTime).toBe('Ongeldige datum')
  })
})

describe('handleProfilePicture', () => {
  it('should return the default profile picture if no image is provided', () => {
    const result = handleProfilePicture(null, false)
    expect(result).toBeTruthy() // Should return the default profile picture
  })

  it('should return the animated emoji if available and online', () => {
    const result = handleProfilePicture(emojis[0].normal, true)
    expect(result).toBe(emojis[0].animated)
  })
})

describe('getAnimatedEmoji', () => {
  it('should return animated emoji if URL matches and is online', () => {
    const result = getAnimatedEmoji(emojis[1].normal, true)
    expect(result).toBe(emojis[1].animated)
  })

  it('should return an empty string if not online', () => {
    const result = getAnimatedEmoji(emojis[1].normal, false)
    expect(result).toBe('')
  })
})

describe('getNormalEmoji', () => {
  it('should return normal emoji if URL matches', () => {
    const result = getNormalEmoji(emojis[2].normal)
    expect(result).toBe(emojis[2].normal)
  })

  it('should return an empty string if no match is found', () => {
    const result = getNormalEmoji('unknown-url')
    expect(result).toBe('')
  })
})
