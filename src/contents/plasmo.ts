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
  showLoadingCursor()
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

function updateDOMWithCompletion(text) {
  console.log("updating DOM with completion text: '", text, "'")

  let activeElement = document.activeElement
  //@ts-ignore
  // activeElement.select()
  // document.execCommand("paste")

  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
  ) {
    activeElement.select()
    // Use the value property for input and textarea elements
    console.log("BG existing text", activeElement.value)
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
    // Special handling for contenteditable
    const replyNode = document.createTextNode(text)
    let selection = window.getSelection()

    if (selection.rangeCount === 0) {
      selection.addRange(document.createRange())
      //@ts-ignore
      selection.getRangeAt(0).collapse(activeElement, 1)
    }

    const range = selection.getRangeAt(0)
    range.collapse(false)

    // Insert reply
    range.insertNode(replyNode)

    selection = document.getSelection()
    // Move the cursor to the end
    selection.collapse(replyNode, replyNode.length)
  }
  restoreCursor()
}

const completeText = async (prompt) => {
  streamCompletion(prompt)
}

document.addEventListener("keydown", async (event) => {
  if (event.key === "m" && event.metaKey) {
    event.preventDefault()
    const text = document.getSelection().toString().trim()
    copy(text)
  }

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

    let activeElement = document.activeElement
    let prompt = ""
    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement
    ) {
      // Use the value property for input and textarea elements
      prompt = activeElement.value
    } else if (activeElement.hasAttribute("contenteditable")) {
      // Use the innerHTML property for elements with contenteditable attribute
      prompt = activeElement.innerHTML
    }

    console.log("Prompt: ", prompt)
    completeText(prompt)
  }
})
