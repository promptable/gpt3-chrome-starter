// First, check to see if an OpenAI API key exists and if it is valid
chrome.runtime.onInstalled.addListener((reason) => {
  // Set default preferences
  chrome.storage.sync.set({
    API_KEY: process.env.OPENAI_API_KEY
  })
})

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   // First get the API key from storage
//   console.log("Received message", message)
//   chrome.storage.sync.get(["API_KEY"], function (result) {
//     const data = {
//       model: "text-davinci-003",
//       prompt: message["prompt"],
//       max_tokens: 128,
//       temperature: 0.7
//     }

//     fetch("https://api.openai.com/v1/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: "Bearer " + result.API_KEY
//       },
//       body: JSON.stringify(data)
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         sendResponse(data)
//       })
//       .catch((error) => {
//         console.error(error)
//         sendResponse({ error: error })
//       })
//   })
//   return true
// })

chrome.runtime.onConnect.addListener(function (port) {
  // console.assert(port.name === "completion")
  port.onMessage.addListener(async (msg) => {
    if (msg.type !== "completion") {
      return
    }

    const payload = {
      prompt: msg.prompt,
      model: "text-davinci-003",
      max_tokens: 128,
      temperature: 0.7,
      stream: true
    }

    const res = await fetch("https://api.openai.com/v1/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`
      },
      method: "POST",
      body: JSON.stringify(payload)
    })

    parseJsonSSE({
      data: res.body,
      onParse: (obj) => {
        port.postMessage({
          //@ts-ignore
          completion: obj.choices?.[0].text
        })
      },
      onFinish: () => {}
    })
  })
})

export {}

const parseJsonSSE = async <T>({
  data,
  onParse,
  onFinish
}: {
  data: ReadableStream
  onParse: (object: T) => void
  onFinish: () => void
}) => {
  const reader = data.getReader()
  const decoder = new TextDecoder()

  let done = false
  let tempState = ""

  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const newValue = decoder.decode(value).split("\n\n").filter(Boolean)

    if (tempState) {
      newValue[0] = tempState + newValue[0]
      tempState = ""
    }

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    newValue.forEach((newVal) => {
      try {
        const json = JSON.parse(newVal.replace("data: ", "")) as T

        onParse(json)
      } catch (error) {
        tempState = newVal
      }
    })
  }

  onFinish()
}
