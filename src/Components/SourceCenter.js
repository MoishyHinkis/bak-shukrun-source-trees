import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
function Center(params) {
  const update = (event, newValue, tree) => {
    event.preventDefault();
    params.update(newValue);
  };

  return (
    <tr>
      <td>
        {params.treeNote}
        <input
          type={params.treeType}
          placeholder="הכניסי עץ מרכז רווח"
          defaultValue={params.tree}
          onBlur={(event) => {
            update(event, {
              key: params.id,
              tree: event.target.value,
              source: params.source,
              id: params.id,
            });
          }}
        />
      </td>
      <td>
        <input
          type="text"
          placeholder="הכניסי מרכז רווח"
          className={"w-56"}
          defaultValue={params.source}
          onBlur={(event) => {
            update(event, {
              key: params.id,
              tree: params.tree,
              source: event.target.value,
              id: params.id,
            });
          }}
        />
      </td>
      <td>
        <button
          className={"text-red-500"}
          onClick={() => {
            params.remove(params.id);
          }}
        >
          <FontAwesomeIcon icon={faMinusCircle} />
        </button>
      </td>
    </tr>
  );
}

export default Center;
