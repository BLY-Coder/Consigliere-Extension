chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'getApiKey') {
    const apiKey = localStorage.getItem('apiKey');
    sendResponse(apiKey);
  } else if (request.type === 'setApiKey') {
    localStorage.setItem('apiKey', request.apiKey);
    sendResponse({message: 'API key saved'});
  }
});
