import { spawn, ChildProcess } from 'child_process'
import { app } from 'electron'
import path from 'path'

let pythonProcess: ChildProcess | null = null

export function startPythonBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    const backendDir = app.isPackaged
      ? path.join(process.resourcesPath, 'backend')
      : path.join(__dirname, '..', 'backend')

    pythonProcess = spawn('python', ['-m', 'uvicorn', 'server:app', '--port', '8765', '--host', '127.0.0.1'], {
      cwd: backendDir,
      stdio: 'pipe',
      shell: true,
    })

    pythonProcess.stdout?.on('data', (data) => {
      console.log(`[Python] ${data}`)
    })

    pythonProcess.stderr?.on('data', (data) => {
      const msg = data.toString()
      console.log(`[Python] ${msg}`)
      if (msg.includes('Application startup complete') || msg.includes('Uvicorn running')) {
        resolve()
      }
    })

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python:', err)
      reject(err)
    })

    pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`)
      pythonProcess = null
    })

    // Timeout fallback - resolve after 10s even if no startup message
    setTimeout(() => resolve(), 10000)
  })
}

export function stopPythonBackend() {
  if (pythonProcess) {
    pythonProcess.kill()
    pythonProcess = null
  }
}
