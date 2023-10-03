import { Outlet } from 'react-router-dom';

import Main from '../Main/Main';

import './layout.css';

const Layout = () => {
  return (
    <div className="container">
      <Main />
      <Outlet />
    </div>
  );
};

export default Layout;

