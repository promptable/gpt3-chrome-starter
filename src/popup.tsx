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
        padding: 16
      }}>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px"
        }}>
        <input onChange={(e) => setText(e.target.value)} value={text} />
        <button onClick={handleClick}>Run</button>
        <textarea value={completion} />
      </div>
    </div>
  )
}

export default IndexPopup
