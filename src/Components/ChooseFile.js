import { useState } from "react";

function ChooseFile(params) {
  const [fileValue, setFileValue] = useState();
  const [anotehrFile, setAnotherFile] = useState();

  const process = (event) => {
    event.preventDefault();
    if (typeof anotehrFile === "undefined")
      alert("שימ/י לב נבחר רק קובץ רווח והפסד, ללא קובץ רכוש קבוע");

    if (typeof fileValue !== "undefined") {
      window.excel.excel(
        fileValue,
        window.getSourceTree.getCenters(params.sources),
        window.getSourceTree.getCenters(params.loading),
        anotehrFile
      );
    } else alert("ודאי שישנו לפחות קובץ רווח והפסד");
  };

  return (
    <div>
      <div className={"grid justify-items-center"}>
        <form onSubmit={process}>
          <label htmlFor="file">
            <div className={"bg-gray-200 p-4 cursor-pointer m-2"}>
              {typeof fileValue === "undefined"
                ? "יבוא קובץ רווח והפסד"
                : fileValue.name}
            </div>
          </label>
          <input
            className={"hidden"}
            id="file"
            type="file"
            accept=".xlsx"
            onChange={(event) => {
              setFileValue(event.target.files[0]);
            }}
          />
          <label htmlFor="anotherFile">
            <div className={"bg-gray-200 p-4 cursor-pointer m-2"}>
              {typeof anotehrFile === "undefined"
                ? "יבוא קובץ רכוש קבוע"
                : anotehrFile.name}
            </div>
          </label>
          <input
            className={"hidden"}
            id="anotherFile"
            type="file"
            accept=".xlsx"
            onChange={(event) => {
              setAnotherFile(event.target.files[0]);
            }}
          />
          <div className={"grid justify-items-center"}>
            <input type="submit" value="עבד נתונים" className={"my-4"} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChooseFile;
