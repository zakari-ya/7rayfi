const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

function displayResponse(data) {
  const responseSection = document.getElementById('api-response');
  const responseContent = document.getElementById('response-content');

  responseContent.textContent = JSON.stringify(data, null, 2);
  responseSection.classList.remove('hidden');
}

function displayError(error) {
  const responseSection = document.getElementById('api-response');
  const responseContent = document.getElementById('response-content');

  responseContent.textContent = `Error: ${error.message}`;
  responseSection.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const testApiButton = document.getElementById('test-api');

  if (testApiButton) {
    testApiButton.addEventListener('click', async () => {
      testApiButton.disabled = true;
      testApiButton.textContent = 'Loading...';

      try {
        const data = await fetchAPI('/api');
        displayResponse(data);
      } catch (error) {
        displayError(error);
      } finally {
        testApiButton.disabled = false;
        testApiButton.textContent = 'Test API Connection';
      }
    });
  }
});
