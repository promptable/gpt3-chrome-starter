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
  const [completion, setCompletion] = useState("")
  const [prompt, setPrompt] = useState("")
  const [stream, setStream] = useState(true)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  const handleClickAway = () => {
    setShow(false)
  }

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleCopy = () => {
    copy(completion)
  }

  const handleMessage = useCallback(
    (msg) => {
      setCompletion((p) => p + msg)
    },
    [setCompletion]
  )

  /**
   * Close the overlay when you click outside of it
   */
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

  /**
   * Keybindings
   */
  useEffect(() => {
    const handleToggleOverlay = (e) => {
      if (e.key === "." && e.metaKey) {
        e.preventDefault()
        setShow((p) => !p)
      }

      if (e.key === "Escape") {
        e.preventDefault()
        setShow(false)
      }

      if (show && !loading && e.key === "Enter") {
        e.preventDefault()
        handleRun(prompt)
      }
    }

    addEventListener("keydown", handleToggleOverlay)

    return () => {
      removeEventListener("keydown", handleToggleOverlay)
    }
  }, [prompt, show, loading])

  const handleRun = async (p: string) => {
    if (loading) {
      return
    }

    setLoading(true)
    setCompletion("")
    if (!stream) {
      const res = await runCompletion({
        prompt: p,
        config: {
          model: "text-davinci-003"
        }
      })
      setCompletion(res)
      setLoading(false)
    } else {
      streamCompletion({
        data: {
          prompt: p,
          config: {
            model: "text-davinci-003"
          }
        },
        onMessage: handleMessage,
        onError: (e) => {
          console.error(e)
          setLoading(false)
        },
        onClose: () => {
          setLoading(false)
        }
      })
    }
  }

  return show ? (
    <div
      ref={wrapperRef}
      className="hw-top"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 12,
        position: "absolute",
        left: "50px",
        top: "100px",
        width: "700px",
        height: "400px",
        borderRadius: "20px"
      }}>
      <input
        placeholder="Ask FullMetal. What to do?"
        value={prompt}
        onChange={handlePromptChange}
        autoFocus
        style={{
          fontSize: "20px",
          padding: 10
        }}
      />
      <div
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          padding: "10px"
        }}>
        Nen
      </div>
      <div
        style={{
          flexGrow: 1,
          height: "1px",
          overflowY: "auto",
          padding: "5px"
        }}>
        {completion}
      </div>
      <div>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={() => handleRun(prompt)}>Run</button>
        <button onClick={() => setStream((p) => !p)}>
          {stream ? "Streaming On" : "Streaming Off"}
        </button>
      </div>
    </div>
  ) : null
}

export default PlasmoOverlay
