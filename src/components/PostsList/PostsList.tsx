import { useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';

import { PostItem, useUserStore, usePostsStore } from '../..';

import './postsList.css';

export const PostsList: FC = () => {
  const { userId } = useParams();

  const isUsersLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);
  const userPosts = usePostsStore((state) => state.userPosts);
  const userPostsError = usePostsStore((state) => state.userPostsError);
  const getUserPosts = usePostsStore((state) => state.getUserPosts);

  useEffect(() => {
    if (userId != undefined) {
      if (userId.includes('-')) {
        const ids = userId.split('-');
        getUserPosts(Number(ids[0]), Number(ids[ids.length - 1]), users);
      } else {
        getUserPosts(Number(userId));
      }
    }
  }, [userId, isUsersLoading]);

  if (userPostsError) {
    return (
      <div>Failed to get posts</div>
    );
  }

  return (
    <div className="layout-container__posts post">
      {userPosts.map((post, index) =>
        <PostItem key={`${post.id}-${index}`} postItem={post} />
      )}
    </div>
  );
};

