const db = require("electron-db");
const path = require("path");
const fs = require("fs");
const  ExcelJS = require("exceljs");
const { ipcRenderer } = require("electron");

const location = path.join(__dirname, "../database");

function saveCenters(dbName, name, centers) {
  if (validate(dbName)) {
    db.updateRow(dbName, location, name, { centers }, (succ, msg) => {
      if (!succ) {
        createCenters(dbName, name);
        saveCenters(dbName, name, centers);
      }
    });
  } else alert("database do not validate");
}

function getCenters(dbName) {
  let centers = [];
  if (validate(dbName)) {
    db.getRows(dbName, location, { name: dbName }, (succ, data) => {
      if (succ && data.length > 0) centers = data[0].centers;
      else
        alert(
          "get centers: " +
            data +
            "this alert is shown because there a problem with this table, maybe it's beacuse it's empty' try to fill it up, if this alert still shown, please talk to manager"
        );
    });
  } else alert("database do not validate");
  return centers;
}

const createCenters = (dbName, name) => {
  db.insertTableContent(dbName, location, name, (succ, msg) => {
    alert("create centers" + succ + msg);
  });
};

const validate = (dbName) => {
  let valid = false;
  if (fs.existsSync(path.join(location, `${dbName}.json`))) {
    valid = db.valid(dbName, location);
  } else {
    db.createTable(dbName, location, (succ, msg) => {
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

async function exportToExcel(file, sources, treeHeader, sourceHeader) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Main");
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
  const Aval = worksheet.getColumn("A").values;
  const Bval = worksheet.getColumn("B").values;
  Aval.forEach((value, index) => {
    centers.push({
      key: index - 2,
      tree: Bval[index],
      source: Aval[index],
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
