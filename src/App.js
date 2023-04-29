import { React } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import Header from './components/utils/Header';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Profile from './components/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Header path='inicio'/><Home /></>
  },
  {
    path: '/cadastrar',
    element: <><Header path='entrar'/><SignUp /></>
  },
  {
    path: '/entrar',
    element: <><Header path='entrar'/><SignIn /></>
  },
  {
    path: '/perfil',
    element: <><Header path='entrar'/><Profile /></>
  },
]);

export default function App() {
  return (
    <>
      
      <RouterProvider router={router} className='router'/>
    </>
  )
}