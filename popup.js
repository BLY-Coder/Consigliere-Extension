function showResults(results) {
  const tableBody = document.getElementById('breach-results');

  tableBody.innerHTML = '';

  results.forEach(item => {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    const sourceCell = row.insertCell();


    cell.innerHTML = item.line;
    sourceCell.innerHTML = item.source;
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
  const saveApiKeyCheckbox = document.getElementById('save-api-key-checkbox');

  chrome.storage.local.get(['apiKey'], function(result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
      saveApiKeyCheckbox.checked = true;
    }
  });

  submitBtn.addEventListener('click', function() {
    const email = emailInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    const saveApiKey = saveApiKeyCheckbox.checked;

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
  if (saveApiKey) {
    chrome.storage.local.set({ 'apiKey': apiKey }, function() {
      console.log('API key saved.');
    });
  } else {
    chrome.storage.local.remove('apiKey', function() {
      console.log('API key removed.');
    });
  }
} else {
  const tableBody = document.getElementById('breach-results');
  tableBody.innerHTML = '';
  errorMessage.innerHTML = 'Por favor, ingresa un correo electrónico y una API key válida.';
}

});
});

