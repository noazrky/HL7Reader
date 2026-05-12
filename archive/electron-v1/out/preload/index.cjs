"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("hl7Reader", {
  toggleMenuBar: () => electron.ipcRenderer.invoke("menu:toggle")
});
