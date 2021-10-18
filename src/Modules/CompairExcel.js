const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");
const SourceTree = require("./SourceTree");
const { deleteRow } = require("electron-db");

const workbook = new ExcelJS.Workbook();

let worksheet,
  Aval,
  Bavl,
  Cval,
  Dval,
  Eval,
  Fval,
  Gval,
  Hval,
  Acol,
  Dcol,
  Ecol,
  Fcol,
  Gcol,
  Hcol;

const loadFile = async (file, sheetName) => {
  await workbook.xlsx.load(file);
  worksheet = workbook.getWorksheet(sheetName);
  if (typeof worksheet === "undefined") {
    return false;
  }
  Acol = worksheet.getColumn("A");
  Ecol = worksheet.getColumn("E");
  Fcol = worksheet.getColumn("F");
  Gcol = worksheet.getColumn("G");
  Hcol = worksheet.getColumn("H");
  return true;
};

function newWindow(noSources, sources) {
  let centers = sources.map((source) => {
    return source;
  });
  const centersSource = sources.map((centerSource) => {
    return centerSource.source;
  });
  noSources.forEach((source) => {
    if (!centersSource.includes(source)) {
      centers.push({
        key: centers.length,
        tree: "",
        source: source,
        id: centers.length,
      });
    }
  });
  SourceTree.saveCenters("SourceCenters", { name: "SourceCenters" }, centers);
  ipcRenderer.send("update", "SourceCenters");
}

function compaireToSourceTree(sources) {
  let noSource = [];
  Hval = [];
  let SourcesTree = sources.map((source) => {
    return source.tree;
  });
  let Sources = sources.map((source) => {
    return source.source;
  });
  Ecol = worksheet.getColumn("E");
  Ecol.eachCell((cell, rowNumber) => {
    if (
      (Sources.indexOf(cell.value) === -1 ||
        SourcesTree[Sources.indexOf(cell.value)] === "") &&
      !noSource.includes(cell.value) &&
      cell.value !== "מרכז רווח"
    ) {
      noSource.push(cell.value);
    }
    Hval.push(SourcesTree[Sources.indexOf(cell.value)]);
  });
  Hcol.values = Hval;
  Hcol.header = "עץ מרכזי רווח";

  if (noSource.length > 0) {
    newWindow(noSource, sources);
    return false;
  } else return true;
}

const ResetG = () => {
  Gcol.eachCell((cell, rowNumber) => {
    if (
      Hcol.values[rowNumber] === "מרכז בית יעקב כללי" &&
      Acol.values[rowNumber] !== "הכנסות" &&
      Acol.values[rowNumber] !== "רכוש קבוע"
    ) {
      worksheet.getRow(rowNumber).getCell("G").value = 0;
    }
  });
};

function GminusF() {
  Gval = [];
  Acol.eachCell((cell, rowNumber) => {
    let FX = worksheet.getRow(rowNumber).getCell("F").value;
    if (typeof FX === "object") {
      FX = FX.result;
    } else FX = Number(FX);

    if (cell.value === "הכנסות") {
      Gval.push(-FX);
    } else Gval.push(FX);
  });
  Gcol.values = Gval;
  Gcol.header = "סכום";
}

async function FixedAssets(file) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(file);
  let ws = wb.getWorksheet("DataSheet");
  if (typeof ws === "undefined") {
    return false;
  }
  Dcol = ws.getColumn("D");
  Dcol.eachCell((cell, rowNumber) => {
    if (
      rowNumber !== 1 &&
      ws.getRow(rowNumber).getCell("G").value -
        ws.getRow(rowNumber).getCell("H").value !==
        0
    ) {
      console.log(cell.value);
      let row = [
        "רכוש קבוע",
        "רכוש קבוע",
        cell.value,
        ws.getRow(rowNumber).getCell("E").value,
        ws.getRow(rowNumber).getCell("C").value,
        ws.getRow(rowNumber).getCell("G").value -
          ws.getRow(rowNumber).getCell("H").value,
      ];
      worksheet.addRow(row);
    }
  });
  return true;
}

const loadingCenter = (loading) => {
  let rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (
      row.getCell("A").value !== "הכנסות" &&
      row.getCell("A").value !== "רכוש קבוע" &&
      row.getCell("H").value === "מרכז בית יעקב כללי"
    ) {
      rows.push(row.values);
    }
  });
  loading.forEach((loadCenter, index) => {
    worksheet.addRows(
      rows.map((row, index) => {
        return row.map((cell, index) => {
          switch (index) {
            case 8:
              return loadCenter.source;
            case 7:
              return cell * loadCenter.tree;
            case 5:
              return "מרכז העמסה";

            default:
              return cell;
          }
        });
      })
    );
  });
};

const write = async () => {
  const locate = ipcRenderer.sendSync("save");
  if (!locate.canceled) {
    await workbook.xlsx.writeFile(locate.filePath);
    alert("done");
  }
};

async function allFunctions(file, sheetName, sources, loading, anotehrFile) {
  if (await loadFile(file, sheetName)) {
    if (await FixedAssets(anotehrFile)) {
      GminusF();
      if (compaireToSourceTree(sources)) {
        loadingCenter(loading);
        ResetG();
        await write();
      }
    } else alert('וודאי שיש גליון בשם "FixedAssets"');
  } else alert('לא נמצא גליון בשם "DataSheet" ודאי ששם הגיליון הוא אכן');
}

exports.allFunctions = allFunctions;
exports.newWindow = newWindow;
