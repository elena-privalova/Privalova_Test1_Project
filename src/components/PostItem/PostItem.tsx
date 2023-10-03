import { FC } from 'react';

import './postItem.css';

const PostItem: FC<PostItemProps> = ({ postItem }) => {
  return (
    <div className="posts-container__post post">
      <div>
        <span>Title:</span>
        <p>{postItem.title}</p>
      </div>
      <div>
        <span>Text:</span>
        <p>{postItem.body}</p>
      </div>
    </div>
  );
};

export default PostItem;

