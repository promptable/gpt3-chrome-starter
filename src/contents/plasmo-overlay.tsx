import copy from "copy-to-clipboard"
import cssText from "data-text:~/contents/plasmo-overlay.css"
import type { PlasmoContentScript } from "plasmo"
import { useCallback, useEffect, useRef, useState } from "react"

import { runCompletion, streamCompletion } from "~lib/openai"

export const config: PlasmoContentScript = {
  matches: ["https://*/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [show, setShow] = useState(false)

  const handleClickAway = () => {
    setShow(false)
  }

  const wrapperRef = useRef(null)
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event) => {
      // NOTE: this is because the event.target === <plasmo-csui> shadow dom.
      if (event.target.tagName !== "PLASMO-CSUI") {
        handleClickAway()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const [prompt, setPrompt] = useState("")

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const [completion, setCompletion] = useState("")

  const handleCopy = () => {
    copy(completion)
  }

  const handleMessage = useCallback(
    (msg) => {
      setCompletion((p) => p + msg)
    },
    [setCompletion]
  )

  const [stream, setStream] = useState(true)

  useEffect(() => {
    const handleToggleOverlay = (e) => {
      if (e.key === "." && e.metaKey) {
        e.preventDefault()
        setShow((p) => !p)
      }

      if (e.key === "Enter" && e.metaKey) {
        handleRun(prompt)
      }
    }

    addEventListener("keydown", handleToggleOverlay)

    return () => {
      removeEventListener("keydown", handleToggleOverlay)
    }
  }, [prompt])

  const handleRun = async (p: string) => {
    setCompletion("")
    if (!stream) {
      const res = await runCompletion({
        prompt: p,
        config: {
          model: "text-davinci-003"
        }
      })
      setCompletion(res)
    } else {
      streamCompletion({
        data: {
          prompt: p,
          config: {
            model: "text-davinci-003"
          }
        },
        onMessage: handleMessage,
        onError: () => {},
        onClose: () => {}
      })
    }
  }

  return show ? (
    <div
      ref={wrapperRef}
      className="hw-top"
      style={{
        padding: 12,
        position: "absolute",
        left: "50px",
        width: "500px",
        height: "500px"
      }}>
      <input value={prompt} onChange={handlePromptChange} />
      <button onClick={handleCopy}>Copy</button>
      <button onClick={() => handleRun(prompt)}>Run</button>
      <button onClick={() => setStream((p) => !p)}>
        {stream ? "Streaming On" : "Streaming Off"}
      </button>
      <div>{completion}</div>
    </div>
  ) : null
}

export default PlasmoOverlay
