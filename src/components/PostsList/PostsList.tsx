import { useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';

import { useStore, PostItem } from '../..';

import './postsList.css';

export const PostsList: FC = () => {
  const { userId } = useParams();

  const userPosts = useStore((state) => state.userPosts);
  const getUserPosts = useStore((state) => state.getUserPosts);
  const isUsersLoading = useStore((state) => state.isUsersLoading);

  useEffect(() => {
    if (userId != undefined) {
      if (userId.includes('-')) {
        const ids = userId.split('-');
        getUserPosts(Number(userId[0]), Number(ids[ids.length - 1]));
      }
      else {
        getUserPosts(Number(userId));
      }
    }
  }, [userId, isUsersLoading]);

  return (
    <div className="layout-container__posts post">
      {userPosts.map((post, index) =>
        <PostItem key={`${post.id}-${index}`} postItem={post} />
      )}
    </div>
  );
};

