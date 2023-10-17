import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getUserPosts,
  selectActivePage,
  selectUserPosts
} from '../../store/posts/selectors';
import { selectIsLoading } from '../../store/users/selectors';
import { useUserStore, usePostsStore } from '../../store';
import { PostItem } from '../PostItem';

import './postsList.css';

export const PostsList = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('ids');
  const page = searchParams.get('page');

  const isLoading = useUserStore(selectIsLoading);
  const userPosts = usePostsStore(selectUserPosts);

  const activePage = usePostsStore(selectActivePage);

  useEffect(() => {
    if (userId == undefined || activePage !== Number(page)) {
      return;
    }

    if (!userId.includes('-') && !userId.includes(',')) {
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

