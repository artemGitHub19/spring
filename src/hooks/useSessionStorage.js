import { useState } from 'react';

export const useSessionStorage = function useSessionStorage(key, initialValue) {
  const [data, setData] = useState(() => {
    let value = sessionStorage.getItem(key);

    if (isValueJSON(value)) {
      value = JSON.parse(value);
    }    
    return value ?? initialValue;
  });
  
  function setState(value) {
    setData(value);

    if ( typeof value === 'object') {
      value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value);
    
  }
  return [data, setState];
}

function isValueJSON(value) {
  if (typeof value !== "string") {
      return false;
  }
  try {
      JSON.parse(value);
      return true;
  } catch (error) {
      return false;
  }
}