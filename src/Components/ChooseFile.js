import { useState } from "react";

function ChooseFile(params) {
  const [fileValue, setFileValue] = useState();
  const [anotehrFile, setAnotherFile] = useState();

  const process = (event) => {
    event.preventDefault();
    if (
      typeof fileValue !== "undefined" &&
      typeof anotehrFile !== "undefined"
    ) {
      window.compairExcel.allFunctions(
        fileValue,
        "DataSheet",
        window.getSourceTree.getCenters(params.sources),
        window.getSourceTree.getCenters(params.loading),
        anotehrFile
      );
      setFileValue();
      setAnotherFile();
    } else alert("ודאי שאכן יש שני קבצים");
  };

  return (
    <div>
      <div class="grid justify-items-center">
        <form onSubmit={process}>
          <label htmlFor="file">
            <div class="bg-gray-200 p-4 cursor-pointer m-2">
              {typeof fileValue === "undefined"
                ? "יבוא קובץ רווח והפסד"
                : fileValue.name}
            </div>
          </label>
          <input
            class="hidden"
            id="file"
            type="file"
            accept=".xlsx"
            onChange={(event) => {
              setFileValue(event.target.files[0]);
            }}
          />
          <label htmlFor="anotherFile">
            <div class="bg-gray-200 p-4 cursor-pointer m-2">
              {typeof anotehrFile === "undefined"
                ? "יבוא קובץ רכוש קבוע"
                : anotehrFile.name}
            </div>
          </label>
          <input
            class="hidden"
            id="anotherFile"
            type="file"
            accept=".xlsx"
            onChange={(event) => {
              setAnotherFile(event.target.files[0]);
            }}
          />
          <div class="grid justify-items-center">
            <input type="submit" value="עבד נתונים" class="my-4" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChooseFile;
