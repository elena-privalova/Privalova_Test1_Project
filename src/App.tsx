import { useRoutes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { PostsList } from './components/PostsList';

export const App = () => {
  return useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: 'posts',
          element: <PostsList />
        }
      ]
    }
  ]);
};

