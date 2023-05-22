import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/Header.css';
import { Link } from "react-router-dom";
import logo from '../icons/Logo.svg';

function Header({activeTab}) { 
  const [vacanciesSearchTabClassName, setVacanciesSearchTabClassName] = useState('component-header-tab');
  const [favouritesTabClassName, setFavouritesTabClassName] = useState('component-header-tab');  

  useEffect( () => {  
    if (activeTab === 'VacanciesSearch') {
      setVacanciesSearchTabClassName('component-header-tab-active');
    } else {
      setFavouritesTabClassName('component-header-tab-active');
    } 
  }, [activeTab]); 

  return (
    <header className='component-header'>
      <div className='component-header-title-wrapper'>
        <figure className='component-header-logo-icon-wrapper'>
          <img src={logo} alt='an app logo'></img>
        </figure>
        <h2 className='component-header-app-title'>Jobored</h2>
      </div>
      <div className='component-header-tabs-wrapper'>
        <nav className='component-header-tabs'>
          <Link to="/" className={vacanciesSearchTabClassName}>Поиск Вакансий</Link>
          <Link to="/favourites" className={favouritesTabClassName}>Избранное</Link>
        </nav>  
      </div>        
    </header>
  );
}

export default Header;