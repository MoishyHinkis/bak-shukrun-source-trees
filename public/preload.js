const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld(
  "getSourceTree",
  require("../assets/Modules/SourceTree")
);

contextBridge.exposeInMainWorld("excel", require("../assets/Modules/Excel"));
