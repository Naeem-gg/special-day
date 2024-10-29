import { Metadata } from 'next'
import Confetti from '../components/Confetti'
import ShowData from './ShowData'

export const metadata:Metadata = {
  title:"BIG DAY",
  description:"A small project by NNavjivan to calculate the days left to your special day",
  keywords:["big day","special day", "celebration day","count days from now"]
}
const page = () => {
  
  return (
    <div>
      <Confetti />
      <ShowData />
    </div>
  )
}

export default page
