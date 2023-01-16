import copy from "copy-to-clipboard"
import cssText from "data-text:~/contents/plasmo-overlay.css"
import type { PlasmoContentScript, PlasmoWatchOverlayAnchor } from "plasmo"
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

export const watchOverlayAnchor = (updatePosition) => {
  setInterval(() => {
    updatePosition()
  }, 100)
}

const PlasmoOverlay = () => {
  const [show, setShow] = useState(false)
  const [completion, setCompletion] = useState("")
  const [prompt, setPrompt] = useState("")
  const [stream, setStream] = useState(true)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const [context, setContext] = useState("")

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
      handleScroll()
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
        setContext(document.getSelection().toString())
        setShow((p) => !p)
      }

      if (show && !loading && e.key === "c" && e.metaKey) {
        e.preventDefault()
        copy(completion)
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

    const reqPrompt = context.length ? context + "\n\n" + p : p

    setLoading(true)
    setCompletion("")
    if (!stream) {
      const res = await runCompletion({
        prompt: reqPrompt,
        config: {
          model: "text-davinci-003"
        }
      })
      setCompletion(res)
      setLoading(false)
    } else {
      streamCompletion({
        data: {
          prompt: reqPrompt,
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

  const ref = useRef<HTMLParagraphElement | null>(null)

  const handleScroll = useCallback(() => {
    if (ref.current) {
      ref.current.scroll({
        behavior: "auto",
        top: ref.current.scrollHeight
      })
    }
  }, [])

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
        borderRadius: "20px",
        wordBreak: "break-all",
        boxShadow:
          "0px 22px 38px 18px rgba(0,0,0,0.3),0px 10px 15px -3px rgba(0,0,0,0.1)"
      }}>
      <input
        placeholder="Summarize, Ask, Extract"
        value={prompt}
        onChange={handlePromptChange}
        autoFocus
        style={{
          fontSize: "20px",
          padding: 10
        }}
      />
      {!!context.length && (
        <div>
          <div
            style={{
              paddingTop: "10px",
              paddingBottom: "10px",
              color: "gray",
              fontSize: "20px"
            }}>
            Your selected context:
          </div>
          <p>{context}</p>
        </div>
      )}
      <div
        style={{
          width: "100%",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "space-between"
        }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "20px"
          }}>
          Output
        </div>
        <div
          style={{
            display: "flex",
            gap: "5px"
          }}>
          <button onClick={() => handleRun(prompt)} style={{}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{
                width: "20px",
                height: "20px"
              }}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          <button
            onClick={handleCopy}
            style={{
              borderRadius: "8px"
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              style={{
                width: "20px",
                height: "20px"
              }}>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={ref}
        style={{
          flexGrow: 1,
          height: "1px",
          overflowY: "auto",
          paddingTop: "5px",
          width: "100%"
        }}>
        {completion}
      </div>
      <div>
        <button onClick={() => setStream((p) => !p)}>
          {stream ? "Streaming On" : "Streaming Off"}
        </button>
      </div>
    </div>
  ) : null
}

export default PlasmoOverlay
