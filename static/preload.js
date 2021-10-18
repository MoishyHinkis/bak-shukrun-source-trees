const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld(
  "getSourceTree",
  require("./Modules/SourceTree")
);
contextBridge.exposeInMainWorld(
  "compairExcel",
  require("./Modules/CompairExcel")
);
contextBridge.exposeInMainWorld("check", require("./Modules/check"));
contextBridge.exposeInMainWorld("CHECK", {
  check: () => {
    alert("cehck3");
  },
});
