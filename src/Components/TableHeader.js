import { useState, useEffect } from "react";
import Center from "./SourceCenter";
const centers = require("../Scripts/Centers");

function Header(params) {
  const [centerData, setCenterData] = useState(
    window.getSourceTree.getCenters(params.data)
  );

  const updateCenter = (update) => {
    setCenterData(centers.updateCenter(centerData, update));
  };
  const newCenter = (id) => {
    setCenterData(centers.newCenter(centerData, id));
  };

  const removeCenter = (id) => {
    setCenterData(centers.removeCenter(centerData, id));
  };

  useEffect(() => {
    window.getSourceTree.saveCenters(
      params.data,
      { name: "temp" + params.data },
      centerData
    );
  }, [centerData, params.data]);

  const Centers = () => {
    return (
      <tbody>
        {centerData.map((center) => {
          let tree = center.tree;
          if (window.location.hash === "#/loading") {
            tree = Number(tree * 100).toPrecision(4) + "%";
          }
          return (
            <Center
              key={center.key}
              tree={tree}
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
    if (window.location.hash === "#/loading") {
      let style = "";
      if (sum !== 1) style = "text-red-500";

      return <p class={style}>{sum * 100 + "%"}</p>;
    }
    return <div></div>;
  };

  const save = () => {
    window.getSourceTree.saveCenters(
      params.data,
      { name: params.data },
      centerData
    );
    alert("saved");
  };
  const cencal = () => {
    setCenterData(window.getSourceTree.getCenters(params.data));
  };

  return params.show ? (
    <div class="grid justify-items-center">
      <button
        onClick={() => {
          newCenter(centerData.length);
        }}
      >
        הוסף מרכז
      </button>
      <div>
        <button onClick={save}>save</button>
        <br />
        <button onClick={cencal}>cencal</button>
        <br />

        <button
          onClick={() => {
            window.getSourceTree.exportToExcel(
              params.tree,
              centerData,
              "tree",
              "sources"
            );
          }}
        >
          export to excel
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th class="border-2 border-black p-2">{params.tree}</th>
            <th class="border-2 border-black p-2">{params.source}</th>
          </tr>
        </thead>
        <Centers></Centers>
      </table>
      <Sum />
    </div>
  ) : null;
}

export default Header;
