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

  useEffect(() => {
    const handleToggleOverlay = (e) => {
      if (e.key === "." && e.metaKey) {
        console.log("click")
        e.preventDefault()
        setShow((p) => !p)
      }

      if (e.key === "Enter" && e.metaKey) {
        console.log("click")
        runComp()
      }
    }

    addEventListener("keydown", handleToggleOverlay)

    return () => {
      removeEventListener("keydown", handleToggleOverlay)
    }
  }, [])

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
    console.log("setting val", e.target.value)
    console.log("setting val", e.currentTarget.value)
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

  const runComp = async () => {
    if (!stream) {
      const res = await runCompletion({
        prompt,
        config: {
          model: "text-davinci-003"
        }
      })
      console.log("got res", res)
      setCompletion(res)
    } else {
      streamCompletion({
        data: {
          prompt,
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
      <button onClick={runComp}>run</button>
      <div>{completion}</div>
    </div>
  ) : null
}

export default PlasmoOverlay
