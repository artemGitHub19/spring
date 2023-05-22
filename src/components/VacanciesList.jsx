import React from 'react';
import Vacancy from './Vacancy';
import '../styles/VacanciesList.css';

function VacanciesList({vacanciesToShow, onVacancyChange}) { 

  function handleVacancyChange(updatedVacancy) {
    onVacancyChange(updatedVacancy);    
  }  
 
  return (
    <div className="component-vacancies-list">      
      {        
        vacanciesToShow.map(vacancy => 
          <div key={vacancy.id} data-elem={`vacancy-${vacancy.id}`} className="component-vacancies-vacancy">
            <Vacancy vacancy={vacancy} 
                     onVacancyChange={handleVacancyChange}></Vacancy>
          </div>
        ) 
      }    
    </div>    
  );
}

export default VacanciesList;