import './postItem.css';

type PostItemProps = {
  title: string,
  body: string
};

export const PostItem = ({ title, body }: PostItemProps) => {
  return (
    <div className="post__item">
      <div>
        <span>Title:</span>
        <p>{title}</p>
      </div>
      <div>
        <span>Text:</span>
        <p>{body}</p>
      </div>
    </div>
  );
};

