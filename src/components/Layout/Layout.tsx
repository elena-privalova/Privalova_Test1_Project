import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { Main, WarningToaster } from '.';
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

