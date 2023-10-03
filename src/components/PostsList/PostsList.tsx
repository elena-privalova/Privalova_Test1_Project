import { useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';

import { useStore, PostItem } from '../..';

import './postsList.css';

export const PostsList: FC = () => {
  const { userId } = useParams();
  const formatedId = Number(userId);

  const { userPosts, getUserPosts } = useStore();

  useEffect(() => {
    getUserPosts(formatedId);
  }, [formatedId]);

  return (
    <div className="layout-container__posts post">
      {userPosts.map((post) => <PostItem key={post.id} postItem={post} />)}
    </div>
  );
};

