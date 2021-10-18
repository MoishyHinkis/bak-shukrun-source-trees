import Header from "./TableHeader";
import { useState } from "react";
import ImportCenters from "./ImpotCentets";
function TreeTable(params) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div class="grid">
        <button
          class="justify-self-center m-8 p-4 bg-gray-100 py-4 border-black border-2"
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
      <Header
        tree={params.tree}
        source={params.source}
        show={show}
        data={params.data}
      ></Header>
    </div>
  );
}

export default TreeTable;
