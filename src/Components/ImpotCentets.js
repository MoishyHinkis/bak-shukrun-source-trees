import { useEffect, useState } from "react";

function ImportCenters(params) {
  const [file, setFile] = useState();

  useEffect(() => {
    if (typeof file !== "undefined") {
      window.getSourceTree.importFromXlsx(file, params.sheetName);
      document.getElementById("importCenters").value = null;
      setFile();
      alert("imported");
    }
  }, [params.sheetName, file]);

  return (
    <div>
      <div className={"grid justify-items-center"}>
        <label htmlFor="importCenters">
          <div className={"p-4 bg-gray-200 cursor-pointer"}>
            {typeof file === "undefined"
              ? `יבוא טבלת ${params.import} מאקסל`
              : file.name}
          </div>
        </label>
        <input
          id="importCenters"
          className={"hidden"}
          name="importCenters"
          type="file"
          accept=".xlsx"
          required
          onChange={(event) => {
            setFile(event.target.files[0]);
          }}
        />
      </div>
    </div>
  );
}

export default ImportCenters;
