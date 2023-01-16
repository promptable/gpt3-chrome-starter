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

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        alert("You clicked outside of me!")
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

/**
 * Component that alerts if you click outside of it
 */
export function OutsideAlerter(props) {
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef)

  return <div ref={wrapperRef}>{props.children}</div>
}

const PlasmoOverlay = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    addEventListener("keydown", (e) => {
      if (e.key === "m" && e.metaKey) {
        e.preventDefault()
        setShow((p) => !p)
      }
    })
  }, [])

  return show ? (
    <OutsideAlerter>
      <span
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
    </OutsideAlerter>
  ) : null
}

export default PlasmoOverlay
