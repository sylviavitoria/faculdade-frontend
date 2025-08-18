import React, { useState } from 'react';
import './style/SearchById.css';

interface SearchByIdProps {
  onSearch: (id: number) => void;
  isLoading: boolean;
  placeholder?: string;
  label?: string;
}

const SearchById: React.FC<SearchByIdProps> = ({
  onSearch,
  isLoading,
  placeholder = "Digite o ID para buscar",
  label = "Buscar por ID"
}) => {
  const [searchId, setSearchId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchId.trim());
    if (id && id > 0) {
      onSearch(id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setSearchId(value);
    }
  };

  return (
    <div className="search-by-id">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="searchId">{label}</label>
          <div className="search-input-group">
            <input
              type="text"
              id="searchId"
              value={searchId}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={isLoading}
              className="form-input"
            />
            <button
              type="submit"
              disabled={isLoading || !searchId.trim()}
              className="btn btn-primary search-btn"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Buscando...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchById;
