const SourceTree = require("./SourceTree");
const { ipcRenderer, shell } = require("electron");
const xlsx = require("xlsx");
const path = require("path");
const { existsSync } = require("fs");

let wb, ws, json;

const loadGainFile = async (gainLoseFile) => {
  await gainLoseFile.arrayBuffer().then((data) => {
    wb = xlsx.read(data);
    ws = wb.Sheets["DataSheet"];
    json = xlsx.utils.sheet_to_json(ws);
  });
};

const fixAssets = async (fixAssetsFile) => {
  let fawb, faws;
  await fixAssetsFile.arrayBuffer().then((data) => {
    fawb = xlsx.read(data);
    faws = fawb.Sheets["DataSheet"];
    const fjson = xlsx.utils.sheet_to_json(faws);
    for (let index = 0; index < fjson.length; index++) {
      if (fjson[index]["סכום זכות לתקופה"] - fjson[index]["סכום חובה לתקופה"]) {
        const newRow = {
          "כותרת;": "רכוש קבוע",
          סעיף: "רכוש קבוע",
          חשבון: fjson[index]["חשבון"],
          "תאור חשבון": fjson[index]["תאור חשבון"],
          "מרכז רווח": fjson[index]["סעיף;"],
          סכום: fjson[index]["סכום חובה לתקופה"],
          "סכום 2": fjson[index]["סכום זכות לתקופה"],
        };
        json.push(newRow);
      }
    }
  });
};

const GminusF = () => {
  json.forEach((row) => {
    if (row["כותרת;"] === "הכנסות") {
      row["סכום 2"] = -row["סכום"];
    } else row["סכום 2"] = row["סכום"];
  });
};

const compaireToSources = (sources) => {
  let noSource = [];
  let SourcesTree = sources.map((source) => {
    return source.tree;
  });
  let Sources = sources.map((source) => {
    return source.source;
  });

  json.forEach((row) => {
    const sourceCenter = row["מרכז רווח"];
    const indexInSources = Sources.indexOf(sourceCenter);
    if (
      (indexInSources === -1 || sourceCenter === "") &&
      !noSource.includes(sourceCenter)
    ) {
      noSource.push(sourceCenter);
    }
    row["עץ מרכזי רווח"] = SourcesTree[indexInSources];
  });

  if (noSource.length > 0) {
    updateSources(noSource, sources);
    return false;
  }
  return true;
};

const loadingCenter = (loading) => {
  let jrows = [];
  json.forEach((row) => {
    if (
      row["כותרת;"] !== "הכנסות" &&
      row["כותרת;"] !== "רכוש קבוע" &&
      row["עץ מרכזי רווח"] === "מרכז בית יעקב כללי"
    ) {
      jrows.push({
        "כותרת;": row["כותרת;"],
        סעיף: row["סעיף"],
        חשבון: row["חשבון"],
        "תאור חשבון": row["תאור חשבון"],
        "מרכז רווח": row["מרכז רווח"],
        סכום: row["סכום"],
        "סכום 2": row["סכום 2"],
        "עץ מרכזי רווח": row["עץ מרכזי רווח"],
      });
    }
  });
  console.log(jrows);
  loading.forEach((loadCenter) => {
    jrows.forEach((jrow) => {
      json.push({
        "כותרת;": jrow["כותרת;"],
        סעיף: jrow["סעיף"],
        חשבון: jrow["חשבון"],
        "תאור חשבון": jrow["תאור חשבון"],
        "מרכז רווח": "מרכז העמסה",
        סכום: jrow["סכום"],
        "סכום 2": (jrow["סכום 2"] * loadCenter.tree) / 100,
        "עץ מרכזי רווח": loadCenter.source,
      });
    });
  });
  console.log(json);
};
const resetG = () => {
  xlsx.utils.sheet_add_json(
    ws,
    json.filter((row) => {
      return (
        !(
          row["כותרת;"] !== "הכנסות" &&
          row["כותרת;"] !== "רכוש קבוע" &&
          row["עץ מרכזי רווח"] === "מרכז בית יעקב כללי"
        ) && row["סכום 2"] !== 0
      );
    })
  );
};

function updateSources(noSources, sources) {
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

const makePivot = (file) => {
  const { execFile, spawn } = require("child_process");
  const isDev = ipcRenderer.sendSync("isDev");
  var pythonProcess;
  if (isDev) {
    pythonProcess = spawn("python", [path.join(__dirname, "Pivot.py"), file]);
  } else
    if (existsSync('./resources/pydistpivot/Pivot/Pivot.exe')) {
      pythonProcess = execFile('./resources/pydistpivot/Pivot/Pivot.exe', [file]);
      pythonProcess.stdout.on("data", (data) => {
        console.log("data: ", data.toString());
      });

      pythonProcess.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
        alert(data);
      });
      pythonProcess.on("exit", (code, signal) => {
        console.log(`exited with code ${code} and signal ${signal}`);
        shell.openPath(file);
      });
      console.log("pivot created");
    }
    else { alert('not exist') }
};

const save = () => {
  const location = ipcRenderer.sendSync("save");
  if (!location.canceled) {
    xlsx.writeFile(wb, location.filePath);
    makePivot(location.filePath);
  }
};

const excel = async (gainLoseFile, sources, loading, fixAssetsFile) => {
  loadGainFile(gainLoseFile)
    .then(() => {
      fixAssets(fixAssetsFile)
        .catch((err) => {
          console.log(err);
          alert("ישנה בעיה בקובץ רכוש קבוע");
        })
        .then(() => {
          GminusF();
          if (compaireToSources(sources)) {
            loadingCenter(loading);
            resetG();
            save();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("בעיה");
        });
      console.log("done");
    })
    .catch((err) => {
      console.log(err);
      alert("ישנה בעיה בקובץ רוח והפסד");
    });
};

exports.excel = excel;
