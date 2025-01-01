"use client";
import { Button } from '@/components/ui/button'
import { parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Countdown = () => {
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
    const interval = setInterval(calculateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const { days, hours, minutes, secs } = formatTime(remainingSeconds);

  const handleReset = () => {
    window.localStorage.clear();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-bold mb-8"
      >
        Your Big Day Countdown
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: "Days", value: days },
          { label: "Hours", value: hours },
          { label: "Minutes", value: minutes },
          { label: "Seconds", value: secs },
        ].map((item) => (
          <div key={item.label} className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-4xl md:text-6xl font-bold mb-2">{item.value}</div>
            <div className="text-xl">{item.label}</div>
          </div>
        ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-xl md:text-2xl mb-8"
      >
        {remainingSeconds > 0
          ? `${name} & ${partnerName}, your special day is coming soon!`
          : `It's your special day, ${name} & ${partnerName}! 🎉`}
      </motion.p>
      <Button onClick={handleReset} variant="secondary" size="lg" className="text-lg">
        Reset Countdown
      </Button>
    </div>
  );
};

export default Countdown;

