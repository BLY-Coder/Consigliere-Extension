document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.container'); // Obtén el elemento del contenedor
  container.style.maxWidth = '800px'; // Establece el ancho máximo del contenedor

  const submitBtn = document.getElementById('submit-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const emailInput = document.getElementById('email-input');
  const saveApiKeyCheckbox = document.getElementById('save-api-key-checkbox');
  const errorMessage = document.getElementById('error-message'); // Agrega el elemento del mensaje de error

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
