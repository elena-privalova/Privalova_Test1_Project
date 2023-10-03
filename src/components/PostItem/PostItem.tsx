import { PostData } from '../../store/types';

import './postItem.css';

type PostItemProps = { postItem: PostData };

const PostItem = (props: PostItemProps) => {
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

export default PostItem;

