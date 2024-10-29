import { Metadata } from "next"
import CoupleForm from "./components/CoupleForm"

export const metaData:Metadata = {
  title:"BIG DAY",
  description:"A small project by NNavjivan to calculate the days left to your special day",
  keywords:["big day","special day", "celebration day","count days from now"]
}
const page = () => {
  return (
    <div>
      <CoupleForm />
     
    </div>
  )
}

export default page