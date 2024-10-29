"use client";
import React, { useState, useEffect } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ResetButton from "./ResetButton";

const ShowCountdown = () => {
  const [remainingDays, setRemainingDays] = useState(0);
const [name,setName] = useState("")
const [partnerName,setPartnerName] = useState("")
const [targetDate, setTargetDate] = useState(new Date());
const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("name") && !localStorage.getItem("partnerName") && !localStorage.getItem("date")) {
      router.push("/")
    }
      setName(localStorage.getItem("name") || "You");
      setPartnerName(localStorage.getItem("partnerName") || "Your Partner");
  setTargetDate(parseISO(localStorage.getItem("date") || ""));
}, [router]);
  
  useEffect(() => {
    const calculateRemainingDays = () => {
      const today = new Date();
      const daysLeft = differenceInDays(targetDate, today);
      setRemainingDays(daysLeft >= 0 ? daysLeft : 0);
    };

    calculateRemainingDays();
    const interval = setInterval(calculateRemainingDays, 86400000); // Update every day
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-7xl font-bold mb-4"
      >
        {remainingDays}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl"
      >
        {remainingDays > 0
          ? `${remainingDays} days left until your special day, ${name} & ${partnerName}!`
          : `It's your special day, ${name} & ${partnerName}! 🎉`}
      </motion.p>
      <ResetButton />
    </div>
  );
};

export default ShowCountdown;
