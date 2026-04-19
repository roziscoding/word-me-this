declare module 'an-array-of-english-words' {
  const words: string[]
  export default words
}

declare module '*.txt?raw' {
  const content: string
  export default content
}
