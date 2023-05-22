import React from 'react';
import { TextInput } from '@mantine/core';
import search from '../icons/Search.svg';
import '../styles/SearchBar.css';

export default function SearchBar({searchKeyword, onSearchButtonClick, onSearchKeywordChange}) {

  function handleSearchButtonClick() {
    onSearchButtonClick(searchKeyword);
  }

  function handleChange(e) {
    onSearchKeywordChange(e.target.value);
  }
  
  return (
    <TextInput
      data-elem="search-input"
      icon={<img src={search} alt='an star icon'></img>}
      classNames={{
        wrapper: 'component-search-bar-wrapper',
        input: 'component-search-bar-input',
        root: 'component-search-bar-root',
        rightSection: 'component-search-bar-right-section',
        icon: 'component-search-bar-icon'
      }}
      onChange={handleChange}
      value={searchKeyword}      
      rightSection={
        <button data-elem="search-button" className='component-search-bar-button' onClick={handleSearchButtonClick}>Поиск</button>
      }      
      placeholder='Введите название вакансии'
    />
  );
}