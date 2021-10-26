const SourceTree = require("./SourceTree");
const { ipcRenderer, shell } = require("electron");
const xlsx = require("xlsx");
let wb, ws;

const loadGainFile = async (gainLoseFile) => {
  await gainLoseFile.arrayBuffer().then((data) => {
    wb = xlsx.read(data);
    ws = wb.Sheets["DataSheet"];
  });
};

const fixAssets = async (fixAssetsFile) => {
  let fawb,
    faws,
    rows = [];
  await fixAssetsFile.arrayBuffer().then((data) => {
    fawb = xlsx.read(data);
    faws = fawb.Sheets["DataSheet"];
    for (
      let index = 1;
      index <= xlsx.utils.decode_range(faws["!ref"]).e.r;
      index++
    ) {
      const Ccell = faws[xlsx.utils.encode_cell({ r: index, c: 2 })];
      const Dcell = faws[xlsx.utils.encode_cell({ r: index, c: 3 })];
      const Ecell = faws[xlsx.utils.encode_cell({ r: index, c: 4 })];
      const Gcell = faws[xlsx.utils.encode_cell({ r: index, c: 6 })];
      const Hcell = faws[xlsx.utils.encode_cell({ r: index, c: 7 })];
      if (Gcell.v - Hcell.v !== 0) {
        rows.push([
          "רכוש קבוע",
          "רכוש קבוע",
          Dcell.v,
          Ecell.v,
          Ccell.v,
          Gcell.v,
          Hcell.v,
        ]);
      }
    }
    xlsx.utils.sheet_add_aoa(ws, rows, { origin: -1 });
  });
};

const GminusF = () => {
  xlsx.utils.sheet_add_aoa(ws, [["סכום"]], {
    origin: { r: 0, c: 6 },
  });
  for (
    let index = 1;
    index <= xlsx.utils.decode_range(ws["!ref"]).e.r;
    index++
  ) {
    const Fcell = ws[xlsx.utils.encode_cell({ r: index, c: 5 })];
    const Acell = ws[xlsx.utils.encode_cell({ r: index, c: 0 })];
    if (Acell.v === "הכנסות") {
      xlsx.utils.sheet_add_aoa(ws, [[-Fcell.v]], {
        origin: { r: index, c: 6 },
      });
    } else
      xlsx.utils.sheet_add_aoa(ws, [[Fcell.v]], {
        origin: { r: index, c: 6 },
      });
  }
};

const compaireToSources = (sources) => {
  let noSource = [];
  let SourcesTree = sources.map((source) => {
    return source.tree;
  });
  let Sources = sources.map((source) => {
    return source.source;
  });
  for (
    let index = 1;
    index <= xlsx.utils.decode_range(ws["!ref"]).e.r;
    index++
  ) {
    const Ecell = ws[xlsx.utils.encode_cell({ r: index, c: 4 })];
    if (
      (Sources.indexOf(Ecell.v) === -1 ||
        SourcesTree[Sources.indexOf(Ecell.v)] === "") &&
      !noSource.includes(Ecell.v)
    ) {
      noSource.push(Ecell.v);
    }
    xlsx.utils.sheet_add_aoa(ws, [[SourcesTree[Sources.indexOf(Ecell.v)]]], {
      origin: { r: index, c: 7 },
    });
  }
  if (noSource.length > 0) {
    updateSources(noSource, sources);
    return false;
  }
  xlsx.utils.sheet_add_aoa(ws, [["עץ מרכזי רווח"]], {
    origin: { r: 0, c: 7 },
  });
  return true;
};

const loadingCenter = (loading) => {
  let rows = [];
  for (
    let index = 0;
    index <= xlsx.utils.decode_range(ws["!ref"]).e.r;
    index++
  ) {
    const Acell = ws[xlsx.utils.encode_cell({ r: index, c: 0 })];
    const Bcell = ws[xlsx.utils.encode_cell({ r: index, c: 1 })];
    const Ccell = ws[xlsx.utils.encode_cell({ r: index, c: 2 })];
    const Dcell = ws[xlsx.utils.encode_cell({ r: index, c: 3 })];
    const Ecell = ws[xlsx.utils.encode_cell({ r: index, c: 4 })];
    const Fcell = ws[xlsx.utils.encode_cell({ r: index, c: 5 })];
    const Gcell = ws[xlsx.utils.encode_cell({ r: index, c: 6 })];
    const Hcell = ws[xlsx.utils.encode_cell({ r: index, c: 7 })];
    if (
      Acell.v !== "הכנסות" &&
      Acell.v !== "רכוש קבוע" &&
      Hcell.v === "מרכז בית יעקב כללי"
    ) {
      rows.push([
        Acell.v,
        Bcell.v,
        Ccell.v,
        Dcell.v,
        Ecell.v,
        Fcell.v,
        Gcell.v,
        Hcell.v,
      ]);
    }
  }
  loading.forEach((loadCenter) => {
    xlsx.utils.sheet_add_aoa(
      ws,
      rows.map((row) => {
        return row.map((cell, index) => {
          switch (index) {
            case 7:
              return loadCenter.source;
            case 6:
              return (cell * loadCenter.tree) / 100;
            case 4:
              return "מרכז העמסה";

            default:
              return cell;
          }
        });
      }),

      { origin: -1 }
    );
  });
};

const resetG = () => {
  for (
    let index = 1;
    index <= xlsx.utils.decode_range(ws["!ref"]).e.r;
    index++
  ) {
    const Acell = ws[xlsx.utils.encode_cell({ r: index, c: 0 })];
    const Hcell = ws[xlsx.utils.encode_cell({ r: index, c: 7 })];
    if (
      Acell.v !== "הכנסות" &&
      Acell.v !== "רכוש קבוע" &&
      Hcell.v === "מרכז בית יעקב כללי"
    ) {
      ws[xlsx.utils.encode_cell({ r: index, c: 6 })].v = 0;
    }
  }
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

const save = () => {
  const location = ipcRenderer.sendSync("save");
  if (!location.canceled) {
    xlsx.writeFile(wb, location.filePath);
    shell.openPath(location.filePath);
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
    })
    .catch((err) => {
      console.log(err);
      alert("ישנה בעיה בקובץ רוח והפסד");
    });
};

exports.excel = excel;
