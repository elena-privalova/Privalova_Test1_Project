import { useEffect, type FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PostItem } from '../PostItem/PostItem';
import { useUserStore, usePostsStore } from '../../store';
import { COUNT_USERS_ON_PAGE } from '../../constants';

import './postsList.css';

export const PostsList: FC = () => {
  const { userId } = useParams();

  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);
  const userPosts = usePostsStore((state) => state.userPosts);

  const activePage = usePostsStore((state) => state.activePage);
  const getUserPosts = usePostsStore((state) => state.getUserPosts);

  const [isSelectUseOnCurrentPage, setIsSelectUseOnCurrentPage] = useState(false);

  useEffect(() => {
    if (userId != undefined) {
      const ids = userId.split('-');
      getUserPosts([...ids], users);
      const isMoreStartInterval = Number(ids[0]) >= (activePage - 1) * COUNT_USERS_ON_PAGE;
      const isLessEndInterval = Number(ids[0]) <= (activePage) * COUNT_USERS_ON_PAGE;
      setIsSelectUseOnCurrentPage(isMoreStartInterval && isLessEndInterval);
    }
  }, [userId, isLoading]);

  return (
    <div className="layout-container__posts post">
      {!isLoading && isSelectUseOnCurrentPage && (
        userPosts.map((post) =>
          <PostItem key={post.id} postItem={post} />
        )
      )}
    </div>
  );
};

