import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

window.addEventListener("load", () => {
  console.log("content script loaded");

  document.body.style.background = "pink"
})


document.addEventListener("keydown", function (event) {
  // Check if the 'ctrl', 'shift' & '.' (Ctrl + >) keys were pressed to trigger the extension
  if (event.ctrlKey && event.shiftKey && (event.key === "." || event.key === ">")) {
    // Prevent the default action
    event.preventDefault();

    // First get the domain name of the current page
    const domain = window.location.hostname;

    console.log("About to run a completion");
    // Next, call domain specific prompt generators
    // if (domain === "medium.com") {
    //   triggerMediumAssist(event);
    // }
  }
});