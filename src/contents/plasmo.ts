import type { PlasmoContentScript } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

const runCompletion = async (prompt: string) => {
  console.log("Sending bg completion req", prompt)
  try {
    const resp = await sendToBackground({
      name: "completion",
      body: {
        prompt
      }
    })

    return resp
  } catch (e) {
    console.error(e)
    throw e
  }
}

function updateDOMWithCompletion(text) {
  console.log("updating DOM with completion text: '", text, "'");
  let activeElement = document.activeElement;

  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      // Use the value property for input and textarea elements
      console.log("existing text", activeElement.value)
      activeElement.value += text;
  } else if (activeElement.hasAttribute("contenteditable")) {
      // Use the innerHTML property for elements with contenteditable attribute
      console.log("existing text", activeElement.innerHTML)
      activeElement.innerHTML += text;
  }
}

const completeText = async (prompt) => {
  console.log("OpenAI complete text triggered");
  const completionText = await runCompletion(prompt)
      updateDOMWithCompletion(completionText);
      console.log("Completion text", completionText);
}

document.addEventListener("keydown", async (event) => {
  // Check if the 'ctrl', 'shift' & '.' (Ctrl + >) keys were pressed to trigger the extension
  if (
    (event.ctrlKey &&
      event.shiftKey &&
      (event.key === "." || event.key === ">")) ||
    (event.key === "Enter" && event.metaKey)
  ) {
    // Prevent the default action
    event.preventDefault()

    // First get the domain name of the current page
    const domain = window.location.hostname

    console.log("About to run a completion on website: ", domain)


      const text = document.getSelection().toString().trim()
    console.log("About to run a completion on website: ", domain);

    let activeElement = document.activeElement;
    let prompt = "";
    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
        // Use the value property for input and textarea elements
        prompt = activeElement.value;
    } else if (activeElement.hasAttribute("contenteditable")) {
        // Use the innerHTML property for elements with contenteditable attribute
        prompt = activeElement.innerHTML;
    }
    
    console.log("Prompt: ", prompt)
    completeText(prompt);
  }
})
