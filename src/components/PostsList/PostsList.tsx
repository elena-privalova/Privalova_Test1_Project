import { useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';

import { PostItem, useUserStore, usePostsStore } from '../..';

import './postsList.css';

export const PostsList: FC = () => {
  const { userId } = useParams();

  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);
  const userPosts = usePostsStore((state) => state.userPosts);
  const userPostsError = usePostsStore((state) => state.userPostsError);
  const getUserPosts = usePostsStore((state) => state.getUserPosts);

  useEffect(() => {
    if (userId != undefined) {
      const ids = userId.split('-');
      getUserPosts([...ids], users);
    }
  }, [userId, isLoading]);

  return (
    <div className="layout-container__posts post">
      {!userPostsError && !isLoading && (
        userPosts.map((post, index) =>
          <PostItem key={`${post.id}-${index}`} postItem={post} />
        )
      )}
    </div>
  );
};

