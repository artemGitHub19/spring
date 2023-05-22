const login = 'sergei.stralenia@gmail.com';
const password = 'paralect123';
const client_id = '2356';
const client_secret = 'v3.r.137440105.ffdbab114f92b821eac4e21f485343924a773131.06c3bdbb8446aeb91c35b80c42ff69eb9c457948';
const hr = '0';
const x_secret_key = 'GEU4nvd3rej*jeh.eqp';

class SuperJobService {
  static async sendAuthorizationQuery() {
    let parameters = {
      login,
      password,
      client_id,
      client_secret,
      hr
    };

    let url = new URL('https://startup-summer-2023-proxy.onrender.com/2.0/oauth2/password/');    

    for (let key in parameters) {
      url.searchParams.set(key, parameters[key]);
    }    

    return fetch(url, {
        headers: {
          'x-secret-key': x_secret_key, 
          'X-Api-App-Id': client_secret,  
        }
    });
  }

  static async sendGetCataloguesQuery() {
    let url = new URL('https://startup-summer-2023-proxy.onrender.com/2.0/catalogues/');      

    return fetch(url, {
      headers: {
        'x-secret-key': x_secret_key,
        'X-Api-App-Id': client_secret,  
      }
    });
  }

  static async sendGetVacanciesQueries(accessToken, parameters) {
    let urls = [];

    for (let i = 0; i < 5; i++) {
      let url = new URL('https://startup-summer-2023-proxy.onrender.com/2.0/vacancies/');    

      for (let key in parameters) {  
        if (parameters[key] && parameters[key] !== '') {
          url.searchParams.set(key, parameters[key]);
        }      
      }    
  
      url.searchParams.set('count', 100);
  
      if (parameters.hasOwnProperty('payment_from') || parameters.hasOwnProperty('payment_to')) {
        url.searchParams.set('no_agreement', 1);
      }   
      url.searchParams.set('page', i);
      urls[i] = url;   
    }

    let requests = urls.map(url => fetch(url, {
      headers: {
        'x-secret-key': x_secret_key,
        'X-Api-App-Id': client_secret,  
        'Authorization': `Bearer ${accessToken}`  
      }
    }));

    return Promise.all(requests);
  }

  static async sendGetVacancyByIdQuery(accessToken, id) {

    let url = new URL(`https://startup-summer-2023-proxy.onrender.com/2.0/vacancies/${id}/`);    

    return fetch(url, {
        headers: {
          'x-secret-key': x_secret_key,
          'X-Api-App-Id': client_secret,  
          'Authorization': `Bearer ${accessToken}`  
        }
    });
  }
}

export default SuperJobService;