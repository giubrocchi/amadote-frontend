import { React } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Header from './components/utils/Header';
import Footer from './components/utils/Footer';
import SignUp from './components/signUp/SignUp';
import SignIn from './components/signIn/SignIn';
import Home from './components/Home';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Header path='inicio'/><Home /><Footer /></>
  },
  {
    path: '/cadastrar',
    element: <><Header path='entrar'/><SignUp /><Footer /></>
  },
  {
    path: '/entrar',
    element: <><Header path='entrar'/><SignIn /><Footer /></>
  },
  {
    path: '/perfil',
    element: <><Header path='entrar'/><Profile /><Footer /></>
  },
  {
    path: '/perfil/editar',
    element: <><Header path='entrar'/><EditProfile /><Footer /></>
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} className='router'/>
    </>
  )
}