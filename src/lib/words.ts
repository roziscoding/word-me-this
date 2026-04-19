import words from 'an-array-of-english-words'

export const fiveLetterWords: string[] = words
  .filter((w: string) => w.length === 5 && /^[a-z]+$/.test(w))
  .sort()
