"use client"
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'

const Confetti = () => {
  const { width, height } = useWindowSize()

  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={100}
      recycle={false}
      run={true}
      opacity={0.6}
    />
  )
}

export default Confetti

