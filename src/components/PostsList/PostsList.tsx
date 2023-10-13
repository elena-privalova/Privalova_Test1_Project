import { useEffect, type FC, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PostItem } from '../PostItem/PostItem';
import { useUserStore, usePostsStore } from '../../store';
import { COUNT_USERS_ON_PAGE } from '../../constants';

import './postsList.css';

export const PostsList: FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('ids');

  const isLoading = useUserStore((state) => state.isLoading);
  const userPosts = usePostsStore((state) => state.userPosts);

  const activePage = usePostsStore((state) => state.activePage);
  const getUserPosts = usePostsStore((state) => state.getUserPosts);

  const [isSelectUserOnCurrentPage, setIsSelectUserOnCurrentPage] = useState(false);

  useEffect(() => {
    if (userId != undefined) {
      const selectedByShift = userId.includes('-');
      const ids = userId.split(/,|-/g);
      getUserPosts([...ids], selectedByShift);
      const isMoreStartInterval = Number(ids[0]) > (activePage - 1) * COUNT_USERS_ON_PAGE;
      const isLessEndInterval = Number(ids[0]) <= (activePage) * COUNT_USERS_ON_PAGE;
      setIsSelectUserOnCurrentPage(isMoreStartInterval && isLessEndInterval);
    }
  }, [userId, isLoading]);

  return (
    <div className="layout-container__posts post">
      {!isLoading && isSelectUserOnCurrentPage && (
        userPosts.map((post) =>
          <PostItem key={post.id} postItem={post} />
        )
      )}
    </div>
  );
};

