"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Redirector = () => {
    const router = useRouter()
    useEffect(() => {
        const countdown = window.localStorage.getItem("countdowns")
        if (countdown) {
            const countdowns = JSON.parse(countdown)
            const countdownId = countdowns[0].id
            router.push(`/countdown?id=${countdownId}`)
        } else {
            router.push("/")
        }
    }, [router])
  return (
    <div/>
  )
}

export default Redirector
