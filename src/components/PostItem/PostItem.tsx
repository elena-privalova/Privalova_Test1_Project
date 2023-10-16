import { PostData } from '../../store/posts/types';

import './postItem.css';

type PostItemProps = { postItem: PostData };

export const PostItem = ({ postItem }: PostItemProps) => {
  return (
    <div className="post__item">
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

