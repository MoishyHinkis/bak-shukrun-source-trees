import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import ChooseFile from "../Components/ChooseFile";
import LoadingTree from "../Components/LoadingTree";
import SourcesTree from "../Components/SourcesTree";
import UpdateSources from "../Components/UpdateSources";
import NavigationBar from "../Layouts/NavigationBar";

const Home = () => {
  return (
    <div>
      <NavigationBar
        page={
          <ChooseFile
            sources="SourceCenters"
            loading="loadingCenters"
          ></ChooseFile>
        }
      />
    </div>
  );
};
const Sources = () => {
  return (
    <div>
      <NavigationBar
        page={
          <SourcesTree
            show="הראה מרכזי רווח"
            hide="הסתר מרכזי רווח"
            tree="עץ מרכזי רווח"
            source="מרכז רווח"
            data="SourceCenters"
          ></SourcesTree>
        }
      />
    </div>
  );
};
const Loading = () => {
  return (
    <div>
      <NavigationBar
        page={
          <LoadingTree
            show="הראה שיעור העמסה למרכזי רווח"
            hide=" הסתר שיעורי העמסה למרכזי רווח"
            tree="שיעור העמסה"
            source="מרכז העמסה"
            data="loadingCenters"
          ></LoadingTree>
        }
      />
    </div>
  );
};
const Update = () => {
  return <UpdateSources></UpdateSources>;
};

const mainRouter = () => {
  return (
    <HashRouter>
      <div className="Router">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sources" component={Sources} />
          <Route exact path="/loading" component={Loading} />
          <Route exact path="/update/:sources" component={Update} />
        </Switch>
      </div>
    </HashRouter>
  );
};

function Router() {
  return mainRouter();
}
export default Router;
