import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('hl7Reader', {
  toggleMenuBar: () => ipcRenderer.invoke('menu:toggle') as Promise<boolean | null>
})
