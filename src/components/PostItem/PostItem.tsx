import { PostData } from '../../store/posts/types';

import './postItem.css';

type PostItemProps = { postItem: PostData };

export const PostItem = (props: PostItemProps) => {
  return (
    <div className="post__item">
      <div>
        <span>Title:</span>
        <p>{props.postItem.title}</p>
      </div>
      <div>
        <span>Text:</span>
        <p>{props.postItem.body}</p>
      </div>
    </div>
  );
};

