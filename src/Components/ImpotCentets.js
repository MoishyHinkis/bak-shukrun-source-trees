import { useEffect, useState } from "react";

function ImportCenters(params) {
  const [file, setFile] = useState();
  const [hasFile, setHasFile] = useState(false);

  useEffect(() => {
    if (hasFile) {
      console.log("hasfile");
      window.getSourceTree.importFromExcel(file, params.sheetName);
      setHasFile(false);
      setFile();
    }
  }, [hasFile, params.sheetName, file]);

  return (
    <div>
      <div class="grid justify-items-center">
        <label htmlFor="importCenters">
          <div class="p-4 bg-gray-200 cursor-pointer">
            {typeof file === "undefined"
              ? `יבוא טבלת ${params.import} מאקסל`
              : file.name}
          </div>
        </label>
        <input
          id="importCenters"
          class="hidden"
          name="importCenters"
          type="file"
          accept=".xlsx"
          required
          onChange={(event) => {
            setFile(event.target.files[0]);
            setHasFile(true);
          }}
        />
      </div>
    </div>
  );
}

export default ImportCenters;
