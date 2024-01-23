import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import './styles.css';
import DetailPage from "./views/DetailPage";
import Homepage from "./views/Homepage";
import NavigationBar from "./components/NavigatİonBar";

function App() {
  const router = createBrowserRouter([
    {
      path: "/detail",
      element: <DetailPage />,
    },
    {
      path: "/",
      element: <Homepage />,
    }
  ]);
  return (
    <div>
      <NavigationBar />
      <div className="mainStyling">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
