import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import HtmlMapper from 'react-html-map';

import Header from '../components/Header';
import Vacancy from '../components/Vacancy';
import Loader from '../components/Loader';
import '../styles/VacancyDetails.css';
import SuperJobService from '../API/SuperJobService';
import Authorization from '../helpers/Authorization';
import FavouriteVacancies from '../helpers/FavouriteVacancies';
import { useSessionStorage } from "../hooks/useSessionStorage";

function VacancyDetails() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useSessionStorage('vacancyDetails_isLoaded', false);
  const [vacancy, setVacancy] = useSessionStorage('vacancyDetails_vacancy', {});
  const location = useLocation();
  let id = location.pathname.split('vacancy/')[1];

  useEffect(() => {
    function searchVacancy() {   
      setIsLoaded(false);  

      let accessToken;

      if ( Authorization.checkAccessToken() ) {  
        accessToken = Authorization.getAccesstoken();
        fetchVacancy(accessToken, id);
      } else {
        SuperJobService.sendAuthorizationQuery()
          .then(res => res.json())
          .then( 
            (data) => {      
              Authorization.setAuthorizationData(data);

              accessToken = data['access_token'];  
        
              fetchVacancy(accessToken, id);
            },        
            (error) => {                    
              setError(error);
              setIsLoaded(true);
            }
          );
      }     
    }    

    if (vacancy && +vacancy?.id !== +id) {
      searchVacancy();      
    } 
    
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }  
  }, []);  

  function fetchVacancy(accessToken, id) {
    SuperJobService.sendGetVacancyByIdQuery(accessToken, id)
      .then(res => res.json())
      .then( 
        (data) => {     
          data.isFavourite = FavouriteVacancies.check(data);
          setVacancy(data);
          setIsLoaded(true);
        },        
        (error) => {                    
          setError(error);
          setIsLoaded(true);
        }
      );      
  }

  function handleVacancyChange(vacancy) {
    setVacancy({...vacancy, isFavourite: vacancy.isFavourite});
  }  

  if (error) {
    return <div className='error-wrapper'>Ошибка: {error.message}</div>;
  } else {    
    return (
      <div className='page-vacancy-details'>
        <Header activeTab='VacanciesSearch'></Header>
        {
          !isLoaded 
          ? <Loader></Loader> 
          : <div className='page-vacancy-details-main-wrapper'>
              <main className='page-vacancy-details-main'> 
                <div className='page-vacancy-details-vacancy-wrapper'>           
                  <Vacancy 
                    vacancy={vacancy} 
                    onVacancyChange={handleVacancyChange}
                    professionElement={
                      <div title={vacancy.profession} className='page-vacancy-details-profession'>{vacancy.profession}</div>
                    }
                    classNames={{
                      wrapper : 'page-vacancy-details-wrapper',
                      description : 'page-vacancy-details-description',
                      salaryAndSchedule : 'page-vacancy-details-salary-and-shedule',
                      salary : 'page-vacancy-details-salary',
                      schedule : 'page-vacancy-details-shedule',
                      locationWrapper : 'page-vacancy-details-location-wrapper',
                      location : 'page-vacancy-details-location'
                    }}>
                  </Vacancy>
                </div>
                <div className='page-vacancy-details-additional-data-wrapper'>
                  <div className='page-vacancy-details-additional-data'>
                    <HtmlMapper html={vacancy.vacancyRichText} acceptUnknown>
                      {{ 
                        p: ({ children }) => <p className='page-vacancy-details-p'>{children}</p>,              
                        ul: ({ children }) => <ul className='page-vacancy-details-ul'>{children}</ul>,
                        li: ({ children }) => <li className='page-vacancy-details-li'>{children}</li>,
                        script: ({ children }) => <p className='' >{children}</p>,       
                        br: () => <br/>,     
                      }}
                    </HtmlMapper>
                  </div> 
                </div>
              </main>
            </div>
        }
      </div>
    );
  }
} 

export default VacancyDetails;