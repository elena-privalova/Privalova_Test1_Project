import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  usePaginatonStore,
  usePostsStore,
  useUserStore
} from '../../store';
import { PostItem } from '../PostItem';

import './postsList.css';

export const PostsList = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('ids');
  const page = searchParams.get('page');

  const isLoading = useUserStore.use.isLoading();
  const getUserPosts = usePostsStore.use.getUserPosts();

  const userPosts = usePostsStore.use.userPosts();

  const activePage = usePaginatonStore.use.activePage();

  useEffect(() => {
    if (userId == undefined || activePage !== Number(page)) {
      return;
    }

    if (userId.match(/-|,/g) == undefined) {
      getUserPosts(userId);
      return;
    }

    getUserPosts();
  }, [userId, isLoading]);

  const isPagesMatch = activePage === Number(page);

  return (
    <div className="layout-container__posts post">
      {!isLoading && isPagesMatch && (
        userPosts.map((post) =>
          <PostItem key={post.id} title={post.title} body={post.body} />
        )
      )}
    </div>
  );
};

