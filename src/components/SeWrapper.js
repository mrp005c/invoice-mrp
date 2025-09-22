"use client"
import { SessionProvider } from "next-auth/react"

export default function SessWrap({children}) {
  return (
    <SessionProvider>
     {children}
    </SessionProvider>
  )
}