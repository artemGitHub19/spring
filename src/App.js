import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VacanciesSearch from './pages/VacanciesSearch';
import Favourites from './pages/Favourites';
import VacancyDetails from './pages/VacancyDetails';
import EmptyState from './pages/EmptyState';

function App() {
  return (
    <Router>  
        <Routes>          
          <Route path="/" element={<VacanciesSearch/>} />      
          <Route path="/favourites" element={<Favourites/>} /> 
          <Route path="/vacancy/:id" element={<VacancyDetails/>} /> 
          <Route path="/emptystate" element={<EmptyState/>} /> 
          <Route path="*" element={<VacanciesSearch/>} />    
        </Routes>
    </Router>
  );  
}

export default App;