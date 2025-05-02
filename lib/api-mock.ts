// Mock API functions to simulate backend functionality
// These would be replaced with real API calls in production

// Mock function to create a new countdown
export async function mockCreateCountdown(
    data: {
      yourName: string
      partnerName: string
      eventDate: Date
      eventTitle: string
      message: string
    },
    accountType: string,
  ) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // Generate a random ID
    const id = Math.random().toString(36).substring(2, 15)
  
    // In a real app, this would save to a database
    // For now, we'll just return the ID and store in localStorage for anonymous users
    if (accountType === "anonymous") {
      try {
        const countdowns = JSON.parse(localStorage.getItem("countdowns") || "{}")
  
        countdowns[id] = {
          id,
          ...data,
          eventDate: data.eventDate.toISOString(), // Convert Date to string for storage
          createdAt: new Date().toISOString(),
          accountType,
        }
  
        localStorage.setItem("countdowns", JSON.stringify(countdowns))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  
    // Return the ID for the countdown
    return id
  }
  
  // Mock function to get a countdown by ID
  export async function mockGetCountdown(id: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
  
    // For anonymous users, try to get from localStorage
    try {
      const countdowns = JSON.parse(localStorage.getItem("countdowns") || "{}")
  
      if (countdowns[id]) {
        // Convert stored date string back to Date object
        return {
          ...countdowns[id],
          eventDate: new Date(countdowns[id].eventDate),
        }
      }
    } catch (error) {
      console.error("Error retrieving from localStorage:", error)
    }
  
    // If not found in localStorage or for account users,
    // this would normally query a database
    // For demo purposes, return mock data
    return {
      id,
      yourName: "Alex",
      partnerName: "Jordan",
      eventDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      eventTitle: "Our Wedding Day",
      message: "Can't wait to spend forever with you!",
      createdAt: new Date().toISOString(),
      accountType: "anonymous",
    }
  }
  