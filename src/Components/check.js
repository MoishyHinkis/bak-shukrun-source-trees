function Check() {
  return (
    <div>
      <h1>check</h1>
      <button
        class="m-8"
        onClick={() => {
          window.check.check();
        }}
      >
        check
      </button>
      <button
        class="m-8"
        onClick={() => {
          alert("check2");
        }}
      >
        check2
      </button>
      <button
        class="m-8"
        onClick={() => {
          window.CHECK.check();
        }}
      >
        check3
      </button>
    </div>
  );
}
export default Check;
