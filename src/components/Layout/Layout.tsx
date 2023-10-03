import { Outlet } from 'react-router-dom';

import { Main } from '../..';

import './layout.css';

export const Layout = () => {
  return (
    <div className="layout-container">
      <Main />
      <Outlet />
    </div>
  );
};

