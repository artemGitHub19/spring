import React, {useEffect} from 'react';
import '../styles/Pagination.css';
import ReactPaginate from 'react-paginate';
import { useSessionStorage } from "../hooks/useSessionStorage";

function Pagination({activePage, pageCount, onPageChange, uniqueName}) {
  const [reactPaginateProperties, setReactPaginateProperties] = useSessionStorage(uniqueName, {
    previousClassName : 'component-react-paginate-page-previous',
    nextClassName : 'component-react-paginate-page-next'
  });   

  useEffect(() => {
    setPaginateProperties(activePage, pageCount);   
  }, [pageCount]);

  function setPaginateProperties(activePage, pageCount) {
    let classNamePrefix = 'component-react-paginate-';
    let previousClassName;
    let nextClassName;
    let isActiveLastPage = (activePage === (pageCount - 1));

    if (activePage === 0) {
      previousClassName = 'page-previous-disabled';
    } else if (reactPaginateProperties.previousClassName !== 'page-previous') {      
      previousClassName = 'page-previous';
    }    

    if (isActiveLastPage) { 
      nextClassName = 'page-next-disabled';
    } else if (reactPaginateProperties.nextClassName !== 'page-next') {
      nextClassName = 'page-next';
    }

    if (previousClassName || nextClassName) {
      let updatedReactPaginateProperties = {...reactPaginateProperties};

      if (previousClassName) {
        updatedReactPaginateProperties.previousClassName = classNamePrefix + previousClassName;
      }

      if (nextClassName) {
        updatedReactPaginateProperties.nextClassName = classNamePrefix + nextClassName;
      }
      setReactPaginateProperties(updatedReactPaginateProperties);
    }    
  }
  
  function handlePageClick(event) {
    let activePage = event.selected;
    setPaginateProperties(activePage, pageCount);
    onPageChange(activePage);
  };
 
  return (            
    <ReactPaginate
      breakLabel="..."
      nextLabel=""
      onPageChange={handlePageClick}
      pageRangeDisplayed={1}
      pageCount={pageCount}
      previousLabel=""
      renderOnZeroPageCount={null}
      className="component-react-paginate-wrapper"
      pageClassName="component-react-paginate-page"
      pageLinkClassName="component-react-paginate-page-link"      
      nextLinkClassName="component-react-paginate-next-link"
      nextClassName={reactPaginateProperties.nextClassName}
      previousClassName={reactPaginateProperties.previousClassName}
      previousLinkClassName="component-react-paginate-previous-link"
      activeLinkClassName="component-react-paginate-active-link"
      activeClassName="component-react-paginate-page-active"
      forcePage={pageCount === 0 ? undefined : activePage}
    />    
  );
}

export default Pagination;