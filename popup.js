function showResults(results) {
  const tableBody = document.getElementById('breach-results');

  tableBody.innerHTML = '';

  results.forEach(item => {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.innerHTML = item.line;
  });
}

function fetchBreachData(email, apiKey) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'breachdirectory.p.rapidapi.com'
    }
  };

  const url = `https://breachdirectory.p.rapidapi.com/?func=auto&term=${email}`;

  return fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const breaches = data.result;
      return breaches;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submit-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const emailInput = document.getElementById('email-input');

  chrome.runtime.sendMessage({ action: 'getApiKey' }, function(response) {
    apiKeyInput.value = response.apiKey;
  });

  submitBtn.addEventListener('click', function() {
    const email = emailInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (email && apiKey) {
      fetchBreachData(email, apiKey)
        .then(breaches => {
          if (breaches.length > 0) {
            showResults(breaches);
          } else {
            const tableBody = document.getElementById('breach-results');
            tableBody.innerHTML = '';
            errorMessage.innerHTML = 'No se encontraron resultados para el correo electrónico ingresado.';
          }
        })
        .catch(error => {
          const tableBody = document.getElementById('breach-results');
          tableBody.innerHTML = '';
          errorMessage.innerHTML = 'Ocurrió un error al buscar información del correo electrónico ingresado. Por favor, verifica la API key e intenta de nuevo.';
        });
    } else {
      const tableBody = document.getElementById('breach-results');
      tableBody.innerHTML = '';
      errorMessage.innerHTML = 'Por favor, ingresa un correo electrónico y una API key válida.';
    }
  });
});
