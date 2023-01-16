import copy from "copy-to-clipboard"
import type { PlasmoContentScript } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

//@ts-ignore
window.AbortController = AbortController

//@ts-ignore
window.fetch = fetch

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

function insertTextAtCaret(text) {
  let range: Range
  let sel: Selection
  if (window.getSelection) {
    console.log("get select")
    sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      console.log("get range at")
      range = sel.getRangeAt(0)
      const prevText = sel.anchorNode.textContent
      console.log("insert text at caret")
      range.insertNode(document.createTextNode(text))
    }
    //@ts-ignore
  } else if (document.selection && document.selection.createRange) {
    console.log("create range")
    //@ts-ignore
    document.selection.createRange().text = text
  }
}

const handleCompletionMessage = (msg: any) => {
  console.log("Handling completion message")
  updateDOMWithCompletion(msg.completion)
}

var port = chrome.runtime.connect({ name: "completion" })
port.onMessage.addListener(handleCompletionMessage)

const streamCompletion = (prompt: string) => {
  // showLoadingCursor()
  port.postMessage({ type: "completion", prompt })
}

const showLoadingCursor = () => {
  const style = document.createElement("style")
  style.id = "cursor_wait"
  style.innerHTML = `* {cursor: wait;}`
  document.head.insertBefore(style, null)
}

const restoreCursor = () => {
  document.getElementById("cursor_wait").remove()
}

const wait = (timeout) => {
  return new Promise((res) => setTimeout(() => res(null), timeout))
}

export const updateDOMWithCompletion = async (text) => {
  console.log("updating DOM with completion text: '", text, "'")

  let activeElement = document.activeElement
  //@ts-ignore
  // activeElement.select()
  // document.execCommand("paste")

  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
  ) {
    // activeElement.select()
    // Use the value property for input and textarea elements
    console.log("TextArea - Existing text: ", activeElement.value)
    // Insert after selection
    activeElement.value =
      activeElement.value.slice(0, activeElement.selectionEnd) +
      text +
      activeElement.value.slice(
        activeElement.selectionEnd,
        //@ts-ignore
        activeElement.length
      )
  } else if (activeElement.hasAttribute("contenteditable")) {
    //@ts-ignore
    activeElement.focus()

    const existingText =
      document.getSelection().toString().trim() ||
      activeElement.textContent.trim()
    console.log("ContentEditable - Existing text: ", existingText)

    await wait(1)

    const displayText = existingText.concat(text)
    console.log("ContentEditable - Display text: ", displayText)
    try {
      document.execCommand("selectAll")
    } catch (e) {}
    try {
      document.execCommand("insertHTML", false, displayText)
    } catch (e) {}

    // CODE BELOW:
    // This works sometimes, but less reliably than "insertHTML"

    // document.execCommand('insertHTML', false, text);
    // // Special handling for contenteditable
    // const replyNode = document.createTextNode(text)
    // let selection = window.getSelection()

    // if (selection.rangeCount === 0) {
    //   selection.addRange(document.createRange())
    //   //@ts-ignore
    //   selection.getRangeAt(0).collapse(activeElement, 1)
    // }

    // const range = selection.getRangeAt(0)
    // range.collapse(false)

    // // Insert reply
    // range.insertNode(replyNode)

    // selection = document.getSelection()
    // // Move the cursor to the end
    // selection.collapse(replyNode, replyNode.length)
  }
  // restoreCursor()
}

const completeText = async (prompt, completionType) => {
  if (completionType === "completion") {
    streamCompletion(prompt)
  } else {
    console.log("Running basic completion")
    chrome.runtime.sendMessage(
      {
        type: "basic_completion",
        prompt: prompt
      },
      function (response) {
        if (response["error"]) {
          console.log(response["error"])
          // mediumStatusUpdate("error");
        } else {
          console.log("Response received successfully")
          const completionText = response.choices[0].text
          console.log("Basic Completion text: ", completionText)
          updateDOMWithCompletion(completionText)
        }
      }
    )
  }
}

document.addEventListener("keydown", async (event) => {
  // Check if the 'ctrl', 'shift' & '.' (Ctrl + >) keys were pressed to trigger the extension
  if (
    event.ctrlKey &&
    event.shiftKey &&
    (event.key === "." || event.key === ">")
  ) {
    // if (
    //   (event.metaKey && event.key === "m")
    // ) {
    // Prevent the default action
    event.preventDefault()

    // First get the domain name of the current page
    const domain = window.location.hostname

    console.log("About to run a completion on website: ", domain)

    let activeElement = document.activeElement
    let prompt
    // If there's an active text input
    if (
      activeElement &&
      //@ts-ignore
      (activeElement.isContentEditable ||
        activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        activeElement.nodeName.toUpperCase() === "INPUT")
    ) {
      // Use selected text or all text in the input
      prompt =
        document.getSelection().toString().trim() ||
        activeElement.textContent.trim()
    } else {
      // If no active text input use any selected text on page
      prompt = document.getSelection().toString().trim()
    }

    console.log("Prompt: ", prompt)

    if (!prompt) {
      alert("No text in active element.")
      return
    }

    //@ts-ignore
    const completionType = activeElement.isContentEditable
      ? "basic_completion"
      : "completion"
    console.log("CompletionType: ", completionType)
    completeText(prompt, completionType)
  }
})
