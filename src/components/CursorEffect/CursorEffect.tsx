"use client"

import { useEffect, useState } from "react"

export default function CursorEffect() {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  useEffect(() => {
    const heroElement = document.querySelector(".hero-chat-container")
    if (!heroElement) return
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    const handleMouseEnter = () => {
      setIsHovering(true)
    }
    const handleMouseLeave = () => {
      setIsHovering(false)
    }
    window.addEventListener("mousemove", updateCursor)
    heroElement.addEventListener("mouseenter", handleMouseEnter)
    heroElement.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updateCursor)
      heroElement.removeEventListener("mouseenter", handleMouseEnter)
      heroElement.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (!isHovering) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:block hidden"
      style={{
        background: `radial-gradient(400px at ${position.x}px ${position.y}px, rgba(255, 204, 0, 0.15), transparent 70%)`,
      }}
    />
  )
}
