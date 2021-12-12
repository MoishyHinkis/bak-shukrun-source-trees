const db = require("electron-db");
const path = require("path");
const fs = require("fs");
const os = require("os");
const xlsx = require("xlsx");
const { ipcRenderer, shell } = require("electron");

function saveCenters(dbName, name, centers) {
  if (validate(dbName)) {
    db.updateRow(dbName, name, { centers }, (succ, msg) => {
      if (!succ) {
        createCenters(dbName, name);
        saveCenters(dbName, name, centers);
      } else ipcRenderer.send("setCenters");
    });
  } else alert("database do not validate");
}

function getCenters(dbName) {
  let centers = [];
  if (validate(dbName)) {
    db.getRows(dbName, { name: dbName }, (succ, data) => {
      if (succ) {
        if (data.length > 0) centers = data[0].centers;
      } else
        alert(
          "get centers: " +
          data +
          "this alert is shown because there a problem with this table, please talk to you'r manager"
        );
    });
  } else alert("database do not validate");
  return centers;
}

const createCenters = (dbName, name) => {
  db.insertTableContent(dbName, name, (succ, msg) => {
    alert("create centers" + succ + msg);
  });
};

const validate = (dbName) => {
  let valid = false;
  if (
    fs.existsSync(
      path.join(os.homedir(), `AppData/Roaming/profit_and_loss_for_organizations/${dbName}.json`)
    )
  ) {
    valid = db.valid(dbName);
  } else {
    db.createTable(dbName, (succ, msg) => {
      valid = succ;
      if (valid) {
        alert(
          "it's seem this is the first time you using this app welcomw!! database created"
        );
      } else alert("can't create database please talk to your manager");
    });
  }
  return valid;
};

const exportToXlsx = async (sheetName, sources, treeHeader, sourceHeader) => {
  try {
    let rows = sources.map((source) => {
      if (sheetName === "loadingCenters") {
        return [source.tree + "%", source.source];
      }
      return [source.tree, source.source];
    });
    rows.unshift([treeHeader, sourceHeader]);
    var ws = xlsx.utils.aoa_to_sheet(rows);
    var wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, sheetName);
    const locate = ipcRenderer.sendSync("save");
    if (!locate.canceled) {
      xlsx.writeFile(wb, locate.filePath);
      shell.openPath(locate.filePath);
    }
  } catch (error) {
    console.log(error);
    alert("שגיאה ביצוא הקובץ פנה למנהל");
  }
};
const importFromXlsx = async (file, sheetName) => {
  file
    .arrayBuffer()
    .then((data) => {
      var wb = xlsx.read(data);
      var ws = wb.Sheets[sheetName];
      let centers = [];
      for (
        let index = 1;
        index <= xlsx.utils.decode_range(ws["!ref"]).e.r;
        index++
      ) {
        const Acell = ws[xlsx.utils.encode_cell({ r: index, c: 0 })];
        const Bcell = ws[xlsx.utils.encode_cell({ r: index, c: 1 })];
        centers.push({
          key: index - 1,
          tree: sheetName === "loadingCenters" ? Acell.v * 100 : Acell.v,
          source: Bcell.v,
          id: index - 1,
        });
      }
      console.log("XLSX: ", centers);
      saveCenters(sheetName, { name: sheetName }, centers);
    })
    .catch((err) => {
      console.log(err);
      alert("שגיאה ביבוא הקובץ פנה למנהל");
    });
};

exports.saveCenters = saveCenters;
exports.getCenters = getCenters;
exports.exportToXlsx = exportToXlsx;
exports.importFromXlsx = importFromXlsx;
