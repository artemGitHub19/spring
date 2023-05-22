class Authorization {

  static checkAccessToken() {
    let result = true;
    let accessTokenExpired = true;
    let accessTokenUndefined = true;

    if (localStorage.authorizationData) { 
      accessTokenUndefined = false;

      let authorizationData = JSON.parse(localStorage.authorizationData);  
      let expirationDate = new Date(authorizationData.expirationDateInSeconds * 1000);
      
      let date = new Date();
      date.setHours(date.getHours() + 1);

      accessTokenExpired = (expirationDate > date) ? false : true;  
    } 

    if (accessTokenUndefined || accessTokenExpired) {
        result = false;
    }

    return result;
  }

  static setAuthorizationData(data) {
    let dataToSave = {
      accessToken : data['access_token'],
      expirationDateInSeconds : data['ttl']
    };
  
    localStorage.setItem('authorizationData', JSON.stringify(dataToSave));
  }

  static getAccesstoken() {
    let authorizationData = JSON.parse(localStorage.authorizationData); 
    return authorizationData['accessToken'];
  }
}

export default Authorization;