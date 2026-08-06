/**
 * SCROLLING TEXT (Client Component)
 *
 * Renders text that's truncated with an ellipsis when it fits,
 * and scrolls back and forth to reveal the full text on hover
 * when it doesn't.
 *
 * - Measures overflow via the wrapper's scrollWidth vs clientWidth.
 * - Re-measures when `text` changes (e.g. a new song is selected)
 *   and whenever the wrapper is resized (e.g. viewport/breakpoint change).
 * - Scroll speed stays constant (~50px/s) regardless of title length —
 *   duration scales with distance instead of being capped, so long
 *   titles take longer to fully reveal rather than scrolling faster.
 * - Respects prefers-reduced-motion, falling back to a plain ellipsis
 *   instead of a hard cut-off (see globals.css).
 */

"use client"

import { useLayoutEffect, useRef, useState } from "react"

interface ScrollingTextProps {
  text: string
  className?: string
}

export default function ScrollingText({ text, className }: ScrollingTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    function measure() {
      const distance = wrapper!.scrollWidth - wrapper!.clientWidth
      setScrollDistance(distance > 0 ? distance : 0)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)

    return () => observer.disconnect()
  }, [text])

  const overflowing = scrollDistance > 0
  // Keep scroll speed constant regardless of title length, rather than
  // capping total duration (which would make the slide phase speed up
  // without bound as distance grows past the cap). The keyframes below
  // spend 35% of the duration on each slide (see scrolling-text-bounce
  // in globals.css), so divide that fraction out to hit ~50px/s.
  const targetPixelsPerSecond = 50
  const slidePortionOfDuration = 0.35
  const scrollDurationSeconds = Math.max(
    4,
    scrollDistance / (targetPixelsPerSecond * slidePortionOfDuration)
  )

  return (
    <div
      ref={wrapperRef}
      className={`scrolling-text-viewport overflow-hidden whitespace-nowrap ${overflowing ? "text-left" : "text-ellipsis"} ${className ?? ""}`}
    >
      {/*
        The span is always rendered at its true, unconstrained width so the
        wrapper above can actually overflow and be measured. Capping the
        span's own width here (e.g. max-w-full) would hide the overflow from
        the measurement in the effect below, keeping it permanently stuck
        in the non-overflowing state.
      */}
      <span
        className={overflowing ? "inline-block scrolling-text-content" : "inline-block"}
        style={
          overflowing
            ? ({
                "--scroll-distance": `${scrollDistance}px`,
                "--scroll-duration": `${scrollDurationSeconds}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </div>
  )
}
