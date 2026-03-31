import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: (filters?: Array<{ name: string; extensions: string[] }>) =>
    ipcRenderer.invoke('dialog:openFile', filters),
  saveFile: (defaultName: string, filters?: Array<{ name: string; extensions: string[] }>) =>
    ipcRenderer.invoke('dialog:saveFile', defaultName, filters),
})
