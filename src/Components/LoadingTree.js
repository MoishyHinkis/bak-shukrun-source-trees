import { useState } from "react";
import Center from "./SourceCenter";
import ImportCenters from "./ImpotCentets";
const centers = require("../Scripts/Centers");

function Header(params) {
  const [centerData, setCenterData] = useState(
    window.getSourceTree.getCenters(params.data)
  );
  const [show, setShow] = useState(false);

  const updateCenter = (update) => {
    setCenterData(centers.updateCenter(centerData, update));
  };
  const newCenter = (id) => {
    setCenterData(centers.newCenter(centerData, id));
  };

  const removeCenter = (id) => {
    setCenterData(centers.removeCenter(centerData, id));
  };

  const Centers = () => {
    return (
      <tbody>
        {centerData.map((center) => {
          return (
            <Center
              treeNote="%"
              treeType={"number"}
              key={center.key}
              tree={center.tree}
              source={center.source}
              id={center.id}
              update={updateCenter}
              remove={removeCenter}
            ></Center>
          );
        })}
      </tbody>
    );
  };

  const Sum = () => {
    let sum = 0;
    centerData.forEach((center) => {
      sum += Number(center.tree);
    });
    let style = "";
    if (sum !== 100) style = "text-red-500";

    return <p className={style}>{sum + "%"}</p>;
  };

  const save = () => {
    window.getSourceTree.saveCenters(
      params.data,
      { name: params.data },
      centerData
    );
  };
  const cencal = () => {
    setCenterData(window.getSourceTree.getCenters(params.data));
  };

  const GetTable = () => {
    return show ? (
      <div className={"grid justify-items-center"}>
        <div className={"grid grid-cols-2 mb-4"}>
          <button
            className={"bg-gray-200 p-1 border-black border-2 m-2"}
            onClick={() => {
              newCenter(centerData.length);
            }}
          >
            הוסף מרכז
          </button>
          <button
            className={"bg-gray-200 p-1 border-black border-2 m-2"}
            onClick={() => {
              window.getSourceTree.exportToXlsx(
                params.data,
                centerData,
                params.tree,
                params.source
              );
            }}
          >
            export to excel
          </button>

          <button
            className={"bg-gray-200 p-1 border-black border-2 m-2"}
            onClick={save}
          >
            save
          </button>
          <button
            className={"bg-gray-200 p-1 border-black border-2 m-2"}
            onClick={cencal}
          >
            cencal
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th className={"border-2 border-black px-8 py-2"}>
                {params.tree}
              </th>
              <th className={"border-2 border-black px-8 py-2"}>
                {params.source}
              </th>
            </tr>
          </thead>
          <Centers></Centers>
        </table>
        <Sum />
      </div>
    ) : null;
  };

  return (
    <div>
      <div className={"grid"}>
        <button
          className={
            "justify-self-center m-8 p-4 bg-gray-100 py-4 border-black border-2"
          }
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? params.hide : params.show}
        </button>
      </div>
      <ImportCenters
        import={params.tree}
        sheetName={params.data}
      ></ImportCenters>
      <GetTable />
    </div>
  );
}

export default Header;
