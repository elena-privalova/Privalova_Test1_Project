import { useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';

import PostItem from '../PostItem/PostItem';
import useStore from '../../store';

import './postsList.css';

const PostsList: FC = () => {
  const { userId } = useParams();
  const formatedId = Number(userId);

  const { userPosts, getUserPosts } = useStore();

  useEffect(() => {
    getUserPosts(formatedId);
  }, [formatedId]);

  return (
    <div className="posts-container">
      {userPosts.map((post) => <PostItem key={post.id} postItem={post} />)}
    </div>
  );
};

export default PostsList;

