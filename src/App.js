import { React } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import Header from './components/utils/Header';
import SignUp from './components/SignUp';
import Home from './components/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Header /><Home /></>
  },
  {
    path: '/entrar',
    element: <><Header /><SignUp /></>
  },
]);

export default function App() {
  return (
    <>
      
      <RouterProvider router={router} className='router'/>
    </>
  )
}