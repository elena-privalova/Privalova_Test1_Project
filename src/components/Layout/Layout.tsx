import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { Main } from '../Main';
import { WarningToaster } from '../WarningToaster';

import './layout.css';

export const Layout = () => {
  return (
    <div className="layout-container">
      <Main />
      <Outlet />
      <WarningToaster />
    </div>
  );
};

