import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

function isElementCompatible(element) {

  // var inputs = ['input', 'select', 'button', 'textarea'];
  const inputs = ['input', 'textarea'];
  console.log("activeElement", element);
  console.log("activeElementTagType", element.tagName)
  
  if (element && inputs.indexOf(element.tagName.toLowerCase()) !== -1) {
      return true;
  }


  
  return false;
}

function updateDOMWithCompletion(text) {
  console.log("updating DOM with completion text: '", text, "'");
  let activeElement = document.activeElement;

  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      // Use the value property for input and textarea elements
      activeElement.value += text;
  } else if (activeElement.hasAttribute("contenteditable")) {
      // Use the innerHTML property for elements with contenteditable attribute
      activeElement.innerHTML += text;
  }
}


function openaiCompleteText(prompt) {
  console.log("OpenAI complete text triggered");
  const completionText = "This is your completion!";  //response.choices[0].text
  updateDOMWithCompletion(completionText);
  // chrome.runtime.sendMessage(
  //   {
  //     function: "complete",
  //     prompt: prompt,
  //   },
  //   function (response) {
  //     if (response["error"]) {
  //       console.log(response["error"]);
  //       // mediumStatusUpdate("error");
  //     } else {
  //       console.log("Response received successfully");
  //       // 
  //       const completionText = "This s your completion!"  //response.choices[0].text
  //       updateDOMWithCompletion(completionText);
  //     }
  //   }
  // );
}

window.addEventListener("load", () => {
  console.log("content script loaded");

  // document.body.style.background = "pink"
})


document.addEventListener("keydown", function (event) {
  // Check if the 'ctrl', 'shift' & '.' (Ctrl + >) keys were pressed to trigger the extension
  if (event.ctrlKey && event.shiftKey && (event.key === "." || event.key === ">")) {
    // Prevent the default action
    event.preventDefault();

    // First get the domain name of the current page
    const domain = window.location.hostname;

    console.log("About to run a completion on website: ", domain);
    
    openaiCompleteText("Hello world.");

    // Next, call domain specific prompt generators
    // if (domain === "medium.com") {
    //   triggerMediumAssist(event);
    // }
  }
});