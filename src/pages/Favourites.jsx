import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import VacanciesList from '../components/VacanciesList';
import Pagination from '../components/Pagination';
import FavouriteVacancies from '../helpers/FavouriteVacancies';
import { useSessionStorage } from "../hooks/useSessionStorage";
import { useNavigate } from 'react-router-dom';
import '../styles/Favourites.css';

function Favourites() {
  const navigate = useNavigate();
  const itemsPerPage = 4;
  const[vacancies, setVacancies] = useState([]);
  const[pageCount, setPageCount] = useState(0);
  const [vacanciesToShow, setVacanciesToShow] = useState([]);   
  const [activePage, setActivePage] = useSessionStorage('favourites_activePage', 0);

  useEffect( () => {
    let vacancies = FavouriteVacancies.getAll();

    if (vacancies.length === 0) {
      navigate('/emptystate');      
    } else {      
      let pageCount = Math.ceil(vacancies.length / itemsPerPage);
      setPageCount(pageCount);

      vacancies.forEach(item => item.isFavourite = true);
      setVacancies(vacancies);

      if (activePage >= pageCount) {
        setActivePage(pageCount - 1);
      }
    }
  }, []);

  useEffect( () => {
    function getVacanciesToShow(newActivePage) {
      let itemOffset = (newActivePage * itemsPerPage) % vacancies.length;
      let endOffset = itemOffset + itemsPerPage;
      let vacanciesToShow = vacancies.slice(itemOffset, endOffset);
      return vacanciesToShow;
    }

    let newVacanciesToShow = getVacanciesToShow(activePage);
    setVacanciesToShow(newVacanciesToShow);
  }, [vacancies, activePage]);  

  function handlePageChange(newActivePage) {    
    setActivePage(newActivePage);  
    scrollToFirstVacancy();
  }

  function scrollToFirstVacancy() {
    if (window.pageYOffset > 97) {
      window.scrollTo(0, 97);
    } 
  }

  function handleVacancyChange(vacancy) {

    let isOneItemOnLastPage = (vacancies.length % itemsPerPage === 1);
    let isLastPageActive = (activePage === (pageCount - 1));

    if (isOneItemOnLastPage && isLastPageActive && activePage === 0) {
      navigate('/emptystate');
    }

    if (isOneItemOnLastPage && isLastPageActive && activePage !== 0) {
      setActivePage(activePage - 1);  
    } 

    if (isOneItemOnLastPage) {  
      setPageCount(pageCount - 1);      
    }

    removeVacancy(vacancy);   
  } 

  function removeVacancy(vacancy) {
    setVacancies(
      vacancies.filter(item =>  item.id !== vacancy.id)
    );      
  }

  return (
    <div className='page-favourites'>
      <Header activeTab="Favourites"></Header>
        <main className='page-favourites-main'> 
          <VacanciesList vacanciesToShow={vacanciesToShow} onVacancyChange={handleVacancyChange}></VacanciesList>
          <nav className='page-favourites-pagination-wrapper'>          
            <Pagination activePage={activePage} 
                        pageCount={pageCount} 
                        onPageChange={handlePageChange}
                        uniqueName="favouritePage"></Pagination>
          </nav>            
        </main>
    </div>
  );
}

export default Favourites;