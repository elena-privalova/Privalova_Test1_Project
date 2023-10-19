import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getUserPosts,
  selectUserPosts
} from '../../store/posts/selectors';
import { selectIsLoading } from '../../store/users/selectors';
import {
  useUserStore,
  usePostsStore,
  usePaginationStore
} from '../../store';
import { selectActivePage } from '../../store/pagination/selectors';
import { PostItem } from '../PostItem';

import './postsList.css';

export const PostsList = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('ids');
  const page = searchParams.get('page');

  const isLoading = useUserStore(selectIsLoading);
  const userPosts = usePostsStore(selectUserPosts);

  const activePage = usePaginationStore(selectActivePage);

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

