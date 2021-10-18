import { useState, useEffect } from "react";
import Center from "./SourceCenter";
import { useParams } from "react-router-dom";
const updateCenters = require("../Scripts/Centers");

function UpdateSources() {
  const { sources } = useParams();
  const [centers, setCenters] = useState(
    window.getSourceTree.getCenters(sources)
  );
  const [nulls, setNulls] = useState(
    centers.filter((center) => {
      return center.tree === "";
    })
  );

  const updateCenter = (update) => {
    setNulls(updateCenters.updateCenter(nulls, update));
  };

  const removeCenter = () => {
    alert("לא ניתן להסיר מרכזים בשלב זה, נא להזין ערכים לכל מרכזיהרווח");
  };

  const updateAll = () => {
    setCenters(updateCenters.updateCenters(centers, nulls));
    alert("updated");
  };

  useEffect(() => {
    window.getSourceTree.saveCenters(sources, { name: sources }, centers);
  }, [centers, sources]);

  const Centers = () => {
    return (
      <tbody>
        {nulls.map((center) => {
          return (
            <Center
              key={center.key}
              tree={center.tree}
              source={center.source}
              id={center.id}
              update={updateCenter}
              remove={removeCenter}
            />
          );
        })}
      </tbody>
    );
  };
  return (
    <div>
      <button
        onClick={() => {
          updateAll();
          window.close();
        }}
      >
        save
      </button>
      <table>
        <thead>
          <tr>
            <th>tree</th>
            <th>source</th>
          </tr>
        </thead>
        <Centers></Centers>
      </table>
    </div>
  );
}

export default UpdateSources;
