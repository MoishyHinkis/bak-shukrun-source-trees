import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
function Center(params) {
  return (
    <tr>
      <td>
        <input
          type="text"
          placeholder="הכניסי עץ מרכז רווח"
          defaultValue={params.tree}
          onBlur={(event) => {
            params.update({
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
          class="w-56"
          defaultValue={params.source}
          onBlur={(event) => {
            params.update({
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
        class="text-red-500"
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