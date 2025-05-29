import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
  export const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
// Calculate time remaining between two dates
export function calculateTimeRemaining(targetDate: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
} {
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: false,
  }
}


export function xorEncryptDecrypt(input: string, key: string): string {
    let output = '';
    for (let i = 0; i < input.length; i++) {
        output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return output;
}

export function base64Encode(input: string): string {
    return btoa(String.fromCharCode(...new TextEncoder().encode(input)));
}

export function base64Decode(input: string): string {
    return new TextDecoder().decode(Uint8Array.from(atob(input), c => c.charCodeAt(0)));
}

export function encryptURL(url: string): string {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;

    searchParams.forEach((value, key) => {
        const encryptedValue = base64Encode(xorEncryptDecrypt(value, key));
        searchParams.set(key, encryptedValue);
    });

    return urlObj.toString();
}

export function decryptURL(url: string): string {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;

    searchParams.forEach((value, key) => {
        const decryptedValue = xorEncryptDecrypt(base64Decode(value), key);
        searchParams.set(key, decryptedValue);
    });

    return urlObj.toString();
}
