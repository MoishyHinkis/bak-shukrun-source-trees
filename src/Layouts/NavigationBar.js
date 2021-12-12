import { Link } from "react-router-dom";

function NavigationBar(params) {
  const homeStyle =
    window.location.hash === "#/"
      ? "border-2 hover:bg-green-700 bg-yellow-500"
      : "border-2 hover:bg-green-700 bg-red-500";
  const sourcesStyle =
    window.location.hash === "#/sources"
      ? "border-2 hover:bg-green-700 bg-yellow-500"
      : "border-2 hover:bg-green-700 bg-red-500";
  const loadingStyle =
    window.location.hash === "#/loading"
      ? "border-2 hover:bg-green-700 bg-yellow-500"
      : "border-2 hover:bg-green-700 bg-red-500";

  return (
    <div>
      <div className={"flex justify-between p-4 mx-24"}>
        <div className={homeStyle}>
          <Link to="/">דף ראשי</Link>
        </div>
        <div className={sourcesStyle}>
          <Link to="/sources">טבלת עץ מרכזי רווח</Link>
        </div>
        <div className={loadingStyle}>
          <Link to="/loading">טבלת שיעורי העמסה</Link>
        </div>
      </div>
      <div>{params.page}</div>
    </div>
  );
}

export default NavigationBar;
