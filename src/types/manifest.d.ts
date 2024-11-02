declare module '*/manifest.json' {
  const manifest: {
    [key: string]: {
      file: string
      src: string
      isEntry?: boolean
      css?: string[]
    }
  }
  export default manifest
}