"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const ResetButton = () => {
    const router = useRouter()
    const handleReset = () => {
        console.log("first")
        window.localStorage.clear()
        router.push("/")
    }
  return (
    <div>
      <Button onClick={handleReset} variant={"ghost"}>Reset</Button>
    </div>
  )
}

export default ResetButton
