import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AdminDashboard from './Components-2/AdminDashboard';
import EmployeeDashboard from './Components-2/EmployeeDashboard';
import ErrorPage from './Components-2/ErrorPage';
import { AppProvider } from './context/AppContext';
import Home from './Components-2/Home';
import LandingDashboard from './Components-2/LandingDashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="adminDashboard" element={<AdminDashboard />} />
      <Route path="empDashboard" element={<EmployeeDashboard />} />
      <Route path="landingPage" element={<LandingDashboard />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    {/* <RouterProvider router={router} /> */}
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </AppProvider>
);
