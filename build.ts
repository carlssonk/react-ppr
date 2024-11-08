import { spawn } from 'child_process'

const createBuildPromise = (mode: string) => {  
  return new Promise((_resolve, reject) => {
    
    const build = spawn('vite', ['build', '--mode', mode], {
      stdio: 'inherit',
      shell: true
    })

    build.on('error', (error) => {
      reject({ mode, error })
    })
  })
}

(async () => {
  try {
    await Promise.all([
      createBuildPromise('client'),
      createBuildPromise('worker'),
      createBuildPromise('prerender')
    ])
  } catch (error) {
    console.error('Build process failed:', error)
    process.exit(1)
  }
})()