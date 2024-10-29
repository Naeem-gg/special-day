"use client";
import { parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResetButton from "./ResetButton";

const ShowCountdown = () => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [name, setName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [targetDate, setTargetDate] = useState<number>(Number(new Date()));
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("name") && !localStorage.getItem("partnerName") && !localStorage.getItem("date")) {
      router.push("/");
    }
    setName(localStorage.getItem("name") || "You");
    setPartnerName(localStorage.getItem("partnerName") || "Your Partner");
    setTargetDate(Number(parseISO(localStorage.getItem("date") || "")));
  }, [router]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = Number(new Date());
      const secondsLeft = Math.max(0, Math.floor((targetDate - now) / 1000));
      setRemainingSeconds(secondsLeft);
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (seconds:number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const { days, hours, minutes, secs } = formatTime(remainingSeconds);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-7xl font-bold mb-4 animate-pulse"
      >
        {days}d {hours}h {minutes}m {secs}s
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-xl mb-6"
      >
        {remainingSeconds > 0
          ? `${days} days, ${hours} hours, ${minutes} minutes, and ${secs} seconds left until your special day, ${name} & ${partnerName}!`
          : `It's your special day, ${name} & ${partnerName}! 🎉`}
      </motion.p>
      <ResetButton />
    </div>
  );
};

export default ShowCountdown;
