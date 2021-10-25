const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld(
  "getSourceTree",
  require("../assets/Modules/SourceTree")
);
contextBridge.exposeInMainWorld(
  "compairExcel",
  require("../assets/Modules/CompairExcel")
);
