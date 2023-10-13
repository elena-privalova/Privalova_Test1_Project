import { useRoutes } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { PostsList } from './components/PostsList/PostsList';

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

