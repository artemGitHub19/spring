class FavouriteVacancies {

  static getAll() {
    let favouritesVacanciesString = localStorage.getItem('favouritesVacancies');
    let favouritesVacancies = [];

    if (favouritesVacanciesString) {
      favouritesVacancies = JSON.parse(favouritesVacanciesString);      
    } 

    return favouritesVacancies;
  }

  static remove(vacancy) {
    let favouritesVacancies = this.getAll();

    let itemIndexToRemove = favouritesVacancies.findIndex(item => item.id === vacancy.id);

    if (itemIndexToRemove !== -1) {
      favouritesVacancies.splice(itemIndexToRemove, 1);
        
      localStorage.setItem('favouritesVacancies', JSON.stringify(favouritesVacancies));
      vacancy.isFavourite = false;
    }
  }

  static add(vacancy) {
    let favouritesVacancies = this.getAll();

    favouritesVacancies.push(vacancy);

    localStorage.setItem('favouritesVacancies', JSON.stringify(favouritesVacancies));
    vacancy.isFavourite = true;    
  }

  static check(vacancy) {
    let result = true;
    let favouritesVacancies = this.getAll();
    let itemIndexToRemove = favouritesVacancies.findIndex(item => item.id === vacancy.id);

    if (itemIndexToRemove === -1) {
      result = false;
    }
    return result;
  }
}

export default FavouriteVacancies;