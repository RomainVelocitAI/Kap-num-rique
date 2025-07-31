// Script de test pour le chatbot
// Usage: node test-chatbot.js

const API_URL = 'http://localhost:3000/api/chatbot';

async function testChatbot(message) {
  try {
    console.log(`\n🤖 Testing message: "${message}"`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error:', response.status, error);
      return;
    }

    const data = await response.json();
    console.log('✅ Response:', data.response);
    console.log('📋 Session ID:', data.sessionId);
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting chatbot tests...\n');
  
  // Test de base
  await testChatbot("Bonjour");
  
  // Test sur la subvention
  await testChatbot("C'est quoi la subvention Kap Numérique ?");
  
  // Test sur les tarifs
  await testChatbot("Combien coûte un site web ?");
  
  // Test sur les services
  await testChatbot("Quels services proposez-vous ?");
  
  // Test sur le contact
  await testChatbot("Comment vous contacter ?");
  
  // Test question hors FAQ
  await testChatbot("Quelle est la météo aujourd'hui ?");
  
  console.log('\n✨ Tests completed!');
}

// Check if API is available
fetch('http://localhost:3000/api/chatbot', { method: 'GET' })
  .then(response => {
    if (response.ok) {
      console.log('✅ API is running');
      runTests();
    } else {
      console.error('❌ API is not available. Make sure the dev server is running.');
    }
  })
  .catch(error => {
    console.error('❌ Cannot connect to API. Make sure the dev server is running on port 3000.');
  });