import { useState } from "react"

import { runCompletion } from "~lib/openai"

function IndexPopup() {
  const [text, setText] = useState("")
  const [completion, setCompletion] = useState("")
  const handleClick = async () => {
    const res = await runCompletion({
      prompt: text,
      config: {
        model: "text-davinci-003",
        max_tokens: 128,
        temperature: 0.7
      }
    })

    setCompletion(text + res.choices[0].text)

    setText("")
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0px",
        width: "500px"
      }}>
      <h1>
        GPT Chrome Starter
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2px"
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleClick();
          }
        }}
        >
        <h2>Input:</h2>
        <textarea onChange={(e) => setText(e.target.value)} value={text} rows={6} style={{
          resize: "vertical"
        }}/>
        <button onClick={handleClick}>Run</button>

        <h2>Output:</h2>
        <textarea value={completion} rows={6} style={{
          resize: "vertical"
        }}/>
      </div>
    </div>
  )
}

export default IndexPopup
