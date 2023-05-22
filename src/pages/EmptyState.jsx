import React from 'react';
import Header from '../components/Header';
import emptyState from '../icons/EmptyState.svg';
import '../styles/EmptyState.css';
import { useNavigate } from 'react-router-dom';

function EmptyState() {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate('/');
  }

  return (
    <div className='page-empty-state'>
        <Header activeTab='Favourites'></Header>
        <div className='page-empty-state-main-wrapper'>
          <div className='page-empty-state-main'>
            <figure className='page-empty-state-icon-wrapper'>
              <img src={emptyState} alt='an empty state icon' className='page-empty-state-icon'></img>
              <figcaption className='page-empty-state-icon-caption'>Упс, здесь еще ничего нет!</figcaption>
            </figure>
            <button className='page-empty-state-button' onClick={handleButtonClick}>Поиск Вакансий</button>            
          </div> 
        </div>     
      </div>
  );
}

export default EmptyState;