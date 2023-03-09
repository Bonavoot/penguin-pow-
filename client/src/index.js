import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainMenu from './MainMenu';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/main-menu",
    element: <MainMenu />
  }
  
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
);

