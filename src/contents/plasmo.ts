import type { PlasmoContentScript } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

const runCompletion = async (prompt: string) => {
  const resp = await sendToBackground({
    name: "completion",
    body: {
      prompt
    }
  })

  return resp
}

window.addEventListener("load", () => {
  console.log("content script loaded")
  // document.body.style.background = "pink"
})

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

    const isContentEditableInputOrTextarea =
      document.activeElement &&
      (document.activeElement.hasAttribute("contenteditable") ||
        document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        document.activeElement.nodeName.toUpperCase() === "INPUT")

    if (isContentEditableInputOrTextarea) {
      // Set as original for later
      const originalActiveElement = document.activeElement

      // Use selected text or all text in the input
      const text =
        document.getSelection().toString().trim() ||
        document.activeElement.textContent.trim()

      const completion = await runCompletion(text)

      // Append the completion
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        // Use the value property for input and textarea elements
        document.activeElement.value += completion
      } else if (document.activeElement.hasAttribute("contenteditable")) {
        // Use the innerHTML property for elements with contenteditable attribute
        document.activeElement.innerHTML += completion
      }
    } else {
      // If no active text input use any selected text on page
      const text = document.getSelection().toString().trim()
    }
  }
})
