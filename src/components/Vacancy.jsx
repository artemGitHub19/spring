import React from 'react';
import { Link } from "react-router-dom";
import location from '../icons/Location.svg';
import FavouriteVacancies from '../helpers/FavouriteVacancies';
import '../styles/Vacancy.css';

function Vacancy({vacancy, onVacancyChange, professionElement, classNames={}}) {

  function handleStarButtonClick() {
    if (vacancy.isFavourite) {
      FavouriteVacancies.remove(vacancy);
    } else {
      FavouriteVacancies.add(vacancy);
    } 
    onVacancyChange(vacancy);   
  }  

  return (
    <div className={classNames.wrapper ?? 'component-vacancy-wrapper'}> 
      <div className={classNames.description ?? 'component-vacancy-description'}> 
        {
          professionElement ?? (
            <Link className='component-vacancy-profession' 
                  title={vacancy.profession}
                  to={`/vacancy/${vacancy.id}`} >{vacancy.profession}</Link>  
          )
        }    
        <div className={classNames.salaryAndSchedule ?? 'component-vacancy-salary-and-shedule'}>          
          <div className={classNames.salary ?? 'component-vacancy-salary'}>
          з/п {vacancy.payment_from} - {vacancy.payment_to} {vacancy.currency}
          </div>
          <div className='component-vacancy-salary-division-icon'>•</div>
          <div className={classNames.schedule ?? 'component-vacancy-shedule'}>
            {vacancy.type_of_work.title}
          </div>
        </div>
        <div className={classNames.locationWrapper ?? 'component-vacancy-location-wrapper'}>
          <div className='component-vacancy-location-icon'>
            <img src={location} alt='an location icon'></img>
          </div>
          <div className={classNames.location ?? 'component-vacancy-location'}>
            {vacancy.town.title}
          </div>        
        </div>                
      </div>
      <div className='component-vacancy-favourite-button-wrapper'> 
        <button data-elem={`vacancy-${vacancy.id}-shortlist-button`}
                className= { 
                  vacancy.isFavourite 
                  ? 'component-vacancy-favourite-button-star-icon-selected' 
                  : 'component-vacancy-favourite-button'
                }
                onClick={handleStarButtonClick}></button>          
      </div>
    </div>
  );
}

export default Vacancy;