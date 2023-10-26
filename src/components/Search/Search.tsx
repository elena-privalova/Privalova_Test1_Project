import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserStore } from '../../store';

import './search.css';

export const Search = () => {
  const searchUsers = useUserStore.use.getSearchUsers();

  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleSearchUsers = () => {
    navigate('/', { replace: true });
    searchUsers(inputRef.current!.value);
  };

  return (
    <div className="layout-container__search search">
      <input
        ref={inputRef}
        className="search__field"
      />
      <button className="search__button" onClick={handleSearchUsers}>Search</button>
    </div>
  );
};

