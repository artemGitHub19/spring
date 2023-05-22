import React, {useState, useEffect} from 'react';
import { NumberInput, Button, Box, Text, Select } from '@mantine/core';
import '../styles/Filter.css';
import chevronDown from '../icons/SelectDown.svg';
import blueChevronUp from '../icons/SelectUp.svg';
import SuperJobService from '../API/SuperJobService';
import { useSessionStorage } from "../hooks/useSessionStorage";

function Filter({onFilterParametersChange, onApplyButtonClick}) {  
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [paymentFrom, setPaymentFrom] = useSessionStorage('paymentFrom', '');
  const [paymentTo, setPaymentTo] = useSessionStorage('paymentTo', '');
  const [selectedCatalogue, setSelectedCatalogue] = useSessionStorage('selectedCatalogue', '');
  const [catalogues, setCatalogues] = useSessionStorage('catalogues', []); 

  useEffect(() => {

    function getCatalogues() {
      SuperJobService.sendGetCataloguesQuery()
        .then(res => res.json())
        .then( 
          (data) => {    
            setCatalogues(data);    
          },        
          (error) => {                    
            console.log(error); 
          }
        );      
    }

    if (catalogues.length === 0) {
      getCatalogues();
    }    
  }, []);

  function handleDropdownOpen() {
    setIsSelectFocused(!isSelectFocused);
  }

  function handleDropdownClose() {
    setIsSelectFocused(!isSelectFocused);
  }

  function handlePaymentToChange(newValue) {
    
    setPaymentTo(newValue);

    let parameters = {
      payment_from : paymentFrom,
      payment_to : newValue,
      catalogues : selectedCatalogue,
    };

    onFilterParametersChange(parameters);
  }

  function handleNumberInputKeyDown(e) {
    if ( !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key) && 
         isNaN(parseInt(e.key))) {      
      e.preventDefault();
    }  
  }  

  function handlePaymentFromChange(newValue) {
    setPaymentFrom(newValue);

    let parameters = {
      payment_from : newValue,
      payment_to : paymentTo,
      catalogues : selectedCatalogue,
    };

    onFilterParametersChange(parameters);
  }  

  function handleClearAllButtonClick() {
    setPaymentFrom('');
    setPaymentTo('');
    setSelectedCatalogue('');
    onFilterParametersChange({});    
  }

  function handleCatalogueChange(newValue) {
    setSelectedCatalogue(newValue);

    let parameters = {
      payment_from : paymentFrom,
      payment_to : paymentTo,
      catalogues : newValue,
    };

    onFilterParametersChange(parameters);
  }

  function handleApplyButtonClick() {
    onApplyButtonClick();
  }

  return (
    <div className='component-filter-container'>
      <div className='component-filter-wrapper'>
        <Box className="component-filter">        
          <form>
            <Box className="component-filter-header">
              <Text className="component-filter-title">Фильтры</Text>
              <Button 
                variant="subtle"
                onClick={handleClearAllButtonClick}
                rightIcon={<div className='component-filter-clear-button-icon'></div>}
                classNames={{
                  root: 'component-filter-clear-button-root',
                  label: 'component-filter-clear-button-label',
                  inner: 'component-filter-clear-button-inner',
                  rightIcon: 'component-filter-clear-button-icon',
                }}
              >Сбросить все</Button>
            </Box>
            <Select
              data-elem="industry-select"
              value={selectedCatalogue}
              title={(catalogues.find(item => item['key'] === selectedCatalogue))?.title_rus}
              onChange={handleCatalogueChange}
              label="Отрасль"
              placeholder="Выберете отрасль"
              searchable
              nothingFound="No options"
              maxDropdownHeight={188}
              data={catalogues.map(item => { 
                return { label : item['title_rus'], value : item['key'] } 
              })}
              classNames={{
                label: 'component-filter-catalogue-select-label',
                rightSection: 'component-filter-catalogue-select-right-section',
                input: 'component-filter-catalogue-select-input',
                root: 'component-filter-catalogue-select-root',
                wrapper: 'component-filter-catalogue-select-wrapper',
              }}
              rightSection={
                <img src={isSelectFocused ? blueChevronUp : chevronDown } 
                    alt="an chevronDown icon"></img>
              }                   
              onDropdownOpen={handleDropdownOpen}
              onDropdownClose={handleDropdownClose}
            />

            <NumberInput
              data-elem="salary-from-input"
              onKeyDown={handleNumberInputKeyDown}   
              onChange={handlePaymentFromChange}
              label="Оклад"
              value={paymentFrom}
              placeholder="От"
              min={0}
              classNames={{
                label: 'component-filter-catalogue-select-label',
                control: 'component-filter-number-input-control',
                controlUp: 'component-filter-number-input-control-up',
                controlDown: 'component-filter-number-input-control-down',
                input: 'component-filter-number-input-input',
                root: 'component-filter-number-input-root',
                wrapper: 'component-filter-number-input-wrapper',
                rightSection: 'component-filter-number-input-right-section'
              }}
            />

            <NumberInput 
              data-elem="salary-to-input"
              onKeyDown={handleNumberInputKeyDown}   
              onChange={handlePaymentToChange}
              placeholder="До"
              value={paymentTo}
              min={0}
              classNames={{
                label: 'component-filter-catalogue-select-label',
                control: 'component-filter-number-input-control',
                controlUp: 'component-filter-number-input-control-up',
                controlDown: 'component-filter-number-input-control-down',
                input: 'component-filter-number-input-input',
                root: 'component-filter-number-input-root',
                wrapper: 'component-filter-number-input-wrapper',
                rightSection: 'component-filter-number-input-right-section'
              }}
            />
            
            <Button data-elem="search-button" 
                    className="component-filter-apply-button" 
                    onClick={handleApplyButtonClick}>Применить</Button>
          </form>
        </Box>
      </div>
    </div>
  );
}

export default Filter;