import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Homepage from './views/Homepage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
  ]);
  return (
    <div className="mainStyling">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
