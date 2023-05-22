import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import VacanciesList from '../components/VacanciesList';
import Filter from '../components/Filter';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

import '../styles/VacanciesSearch.css';
import { useSessionStorage } from "../hooks/useSessionStorage";
import SuperJobService from '../API/SuperJobService';
import Authorization from '../helpers/Authorization';
import FavouriteVacancies from '../helpers/FavouriteVacancies';

function VacanciesSearch() {
  const navigate = useNavigate();
  const itemsPerPage = 4;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useSessionStorage('isLoaded', false);
  const [searchKeyword, setSearchKeyword] = useSessionStorage('searchKeyword', '');
  const [vacancies, setVacancies] = useSessionStorage('vacancies', []);
  const [vacanciesToShow, setVacanciesToShow] = useSessionStorage('vacanciesToShow', []);
  const [filterParameters, setFilterParameters] = useSessionStorage('filterParameters', {});
  const [activePage, setActivePage] = useSessionStorage('activePage', 0);

  useEffect(() => {
    if (vacancies.length !== 0) {
      setFavouriteProperty(vacancies);      
    } else {
      searchVacancies(searchKeyword);    
    } 
  }, []);

  useEffect(() => {
    function getVacanciesToShow() {
      let itemOffset = (activePage * itemsPerPage) % vacancies.length;
      let endOffset = itemOffset + itemsPerPage;
      let vacanciesToShow = vacancies.slice(itemOffset, endOffset);
      return vacanciesToShow;
    }
    
    let newVacanciesToShow = getVacanciesToShow();
    setVacanciesToShow(newVacanciesToShow);  
    
  }, [vacancies, activePage]);

  function setFavouriteProperty(vacancies) {
    let favouriteVacancies = FavouriteVacancies.getAll();

      for (let i = 0; i < vacancies.length; i++) {
        const vacancy = vacancies[i];
        let index = favouriteVacancies.findIndex(item => item.id === vacancy.id);
        vacancy.isFavourite = (index !== -1) ? true : false;              
      }
  }

  function handleFilterParametersChange(params) {
    setFilterParameters(params);
  }

  function handleApplyButtonClick() {
    searchVacancies(searchKeyword);
  }  

  function handleSearchButtonClick(searchKeyword) {
    searchVacancies(searchKeyword);    
  }  

  function handleSearchKeywordChange(searchKeyword) {
    setSearchKeyword(searchKeyword);    
  }

  function handleGetVacanciesQueriesResponse(data) {    
    let vacancies = [];

    if (data) {
      data.forEach(item => {
        vacancies.push(...item['objects']);
      });        
    }        

    if (vacancies.length === 0) {
      navigate('/emptystate');        
    } else {
      setFavouriteProperty(vacancies);
      setActivePage(0);
      setVacancies(vacancies);        
    }    
    setIsLoaded(true); 
  }

  function handleError(error) {
    setError(error);
    setIsLoaded(true);
  }

  function checkResponseStatuses(items) {
    let result = true;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.ok) {
        result = false;
        break;
      }
    }
    return result;
  }

  function getBadResponseStatuses(items) {
    let result = '';
    let uniqueStatuses = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.ok) {
        if (!uniqueStatuses.includes(item.status)) {
          result += 'Код ошибки: ' + item.status + '. ';  
          if (item.statusText) {
            result += item.statusText + '. ' 
          }
          uniqueStatuses.push(item.status);
        }              
      }
    }

    return result;
  }

  function searchVacancies(searchKeyword) {
    let accessToken;

    setError(null);
    setIsLoaded(false);

    if ( Authorization.checkAccessToken() ) {  
      accessToken = Authorization.getAccesstoken();
      let parameters = getQueryParameters(searchKeyword);
      fetchVacancies(accessToken, parameters);      
    } else {
      SuperJobService.sendAuthorizationQuery()
        .then(res => res.json())
        .then( 
          (data) => {      
            Authorization.setAuthorizationData(data);

            accessToken = data['access_token'];
            let parameters = getQueryParameters(searchKeyword);

            fetchVacancies(accessToken, parameters);     
          },        
          (error) => handleError(error)
        );
    }
  }  

  function fetchVacancies(accessToken, parameters) {
    SuperJobService.sendGetVacanciesQueries(accessToken, parameters)  
      .then(
        (responses) => { 
          if ( !checkResponseStatuses(responses) ) {
            Promise.all(responses.filter(r => !r.status.ok).map(r => r.text()))
              .then( r => console.error(r));
            throw new Error(getBadResponseStatuses(responses));                          
          } 
          return Promise.all(responses.map(r => r.json()));          
        }, 
        (error) => handleError(error)
      )  
      .then(
        (data) => handleGetVacanciesQueriesResponse(data), 
        (error) => handleError(error)
      );
  }

  function getQueryParameters(searchKeyword) {
    let parameters = {
      published : 1,
    };

    if (searchKeyword !== '') {
      parameters["keyword"] = searchKeyword;  
    }

    for (const key in filterParameters) {
      if (Object.hasOwnProperty.call(filterParameters, key)) {            
        parameters[key] = filterParameters[key];            
      }
    }
    return parameters;
  }

  function handlePageChange(newActivePage) {   
    scrollToFirstVacancy();    
    setActivePage(newActivePage);  
  }

  function scrollToFirstVacancy() {
    if (window.pageYOffset > 545) {
      window.scrollTo(0, 545);
    } 
  }

  function handleVacancyChange(vacancy) {
    let updatedVacancies = vacancies.map(item => {      
      if (item.id !== vacancy.id) {
        return item;
      } else {        
        return {
          ...item,
          isFavourite: vacancy.isFavourite,
        };
      }
    });

    setVacancies(updatedVacancies);       
  }  

  if (error) {
    return <div className='error-wrapper'>{error.message}</div>;
  } else {    
    return (
      <div className='page-vacancies-search'>
        <Header activeTab='VacanciesSearch'></Header>
          {
            !isLoaded 
            ? <Loader></Loader>           
            :  <div className='page-vacancies-search-filter-and-main-wrapper'>
                <Filter onFilterParametersChange={handleFilterParametersChange} onApplyButtonClick={handleApplyButtonClick}></Filter>
                <main className='page-vacancies-search-main'>
                  <div>
                    <div className='page-vacancies-search-search-bar-wrapper'>
                      <SearchBar searchKeyword={searchKeyword} 
                                onSearchButtonClick={handleSearchButtonClick}
                                onSearchKeywordChange={handleSearchKeywordChange}></SearchBar> 
                    </div>
                    <VacanciesList vacanciesToShow={vacanciesToShow} onVacancyChange={handleVacancyChange}></VacanciesList>
                  </div>
                  <nav className='page-vacancies-search-pagination-wrapper'>            
                    <Pagination activePage={activePage} 
                                pageCount={Math.ceil(vacancies.length / itemsPerPage)} 
                                onPageChange={handlePageChange}
                                uniqueName="vacanciesSearchPage"></Pagination>
                  </nav>              
                </main>
              </div>  
          } 
      </div>        
    );
  }    
}

export default VacanciesSearch;