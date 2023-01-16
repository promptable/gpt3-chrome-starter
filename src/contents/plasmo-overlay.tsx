import cssText from "data-text:~/contents/plasmo-overlay.css"
import type { PlasmoContentScript } from "plasmo"
import { useEffect, useRef, useState } from "react"

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

  return show ? (
    <span
      ref={wrapperRef}
      className="hw-top"
      style={{
        opacity: "15%",
        padding: 12,
        position: "absolute",
        left: "50px",
        width: "500px",
        height: "500px"
      }}>
      HELLO WORLD TOP
    </span>
  ) : null
}

export default PlasmoOverlay
