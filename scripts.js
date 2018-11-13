// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');

  program.init(domains);
});

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  /* Hvað gera skal við items */
  function displayItems(djl, title, item) {
    const itemElement = document.createElement('dt');
    itemElement.appendChild(document.createTextNode(title));
    djl.appendChild(itemElement);

    const itemValueElement = document.createElement('dd');
    itemValueElement.appendChild(document.createTextNode(item));
    djl.appendChild(itemValueElement);

    /* container */
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(djl);
  }

  /* Fall fyrir items */
  function displayIsnic(domainsList) {
    if (domainsList.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }
    const [{
      domain, registrantname, address, country, email, registered, expires, lastChange,
    }] = domainsList;
    const dl = document.createElement('dl');
    displayItems(dl, 'Lén', domain);
    displayItems(dl, 'Skráð', new Date(registered).toISOString().split('T')[0]);
    displayItems(dl, 'Síðast breytt', new Date(lastChange).toISOString().split('T')[0]);
    displayItems(dl, 'Rennur út', new Date(expires).toISOString().split('T')[0]);
    if (registrantname) {
      displayItems(dl, 'Skráningaraðili', registrantname);
    }
    if (email) {
      displayItems(dl, 'Netfang', email);
    }
    if (address) {
      displayItems(dl, 'Heimilisfang', address);
    }
    if (country) {
      displayItems(dl, 'Land', country);
    }
  }

  /* error fall */
  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(document.createTextNode(error));
  }

  /* loading gif */
  function loader() {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const loadingitem = document.createElement('div');
    loadingitem.classList.add('loading');

    const img = document.createElement('img');
    img.classList.add('img');
    img.setAttribute('src', 'loading.gif');
    loadingitem.appendChild(img);

    const text = document.createElement('span');
    text.appendChild(document.createTextNode('Leita að léni...'));
    loadingitem.appendChild(text);
    container.appendChild(loadingitem);
  }

  /* Ná á í data */
  function fetchData(number) {
    loader();
    fetch(`${API_URL}${number}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp');
      })
      .then((data) => {
        displayIsnic(data.results);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error); /*eslint-disable */
      });
  }

  /* Submit og núlla tóman streng */
  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input.value.trim().length === 0) {
      displayError('Lén verður að vera strengur');
      input.value = '';
      return;
    }
    fetchData(input.value);
  }

  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();
