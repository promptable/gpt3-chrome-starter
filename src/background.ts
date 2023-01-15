console.log("HELLO WORLD FROM BGSCRIPTS")

// First, check to see if an OpenAI API key exists and if it is valid
chrome.runtime.onInstalled.addListener((reason) => {
    // Set default preferences
    chrome.storage.sync.set({
      API_KEY: process.env.OPENAI_API_KEY
    });
  });
  

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // First get the API key from storage
    console.log("Received message", message);
    chrome.storage.sync.get(
      ["API_KEY"],
      function (result) {
        const data = {
          model: "text-davinci-003",
          prompt: message["prompt"],
          max_tokens: 128,
          temperature: 0.7,
        };
  
        fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + result.API_KEY,
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            sendResponse(data);
          })
          .catch((error) => {
            console.error(error);
            sendResponse({ error: error });
          });
      }
    );
    return true;
  });


export {}
