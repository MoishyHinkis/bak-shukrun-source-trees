
const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld(
  "getSourceTree",
  require("../src/modules/SourceTree")
);
contextBridge.exposeInMainWorld(
  "compairExcel",
  require("../src/modules/CompairExcel")
);
