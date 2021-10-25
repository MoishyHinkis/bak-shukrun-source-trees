const db = require("electron-db");
const path = require("path");
const fs = require("fs");
const os = require("os");
const ExcelJS = require("exceljs");
const { ipcRenderer } = require("electron");

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
      path.join(os.homedir(), `AppData/Roaming/excel-2/${dbName}.json`)
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

async function exportToExcel(sheetNaem, sources, treeHeader, sourceHeader) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetNaem);
  let Aval = sources.map((source) => {
    return source.tree;
  });
  let Bval = sources.map((source) => {
    return source.source;
  });
  Aval.unshift(treeHeader);
  Bval.unshift(sourceHeader);
  worksheet.getColumn("A").values = Aval;
  worksheet.getColumn("B").values = Bval;

  const locate = ipcRenderer.sendSync("save");
  if (!locate.canceled) {
    await workbook.xlsx.writeFile(locate.filePath);
  }
}

async function importFromExcel(file, sheetName) {
  let centers = [];
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);
  const worksheet = workbook.getWorksheet(sheetName);
  if (typeof worksheet === "undefined") {
    alert(`אנא ודא/י שיש בקובץ טבלה בשם ${sheetName}`);
    return;
  }
  const Aval = worksheet.getColumn("A").values;
  const Bval = worksheet.getColumn("B").values;
  Aval.forEach((value, index) => {
    const tree =
      sheetName === "loadingCenters" ? Number(Aval[index]) * 100 : Aval[index];
    centers.push({
      key: index - 2,
      tree: tree,
      source: Bval[index],
      id: index - 2,
    });
  });
  centers.shift();

  saveCenters(sheetName, { name: sheetName }, centers);
}

exports.saveCenters = saveCenters;
exports.getCenters = getCenters;
exports.exportToExcel = exportToExcel;
exports.importFromExcel = importFromExcel;
