import { useState } from "react"
import { AuthContext } from "./AuthContext"


// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Sign in method
  const signIn = async (email, password) => {
  try {
    // Send GET request to API for users
    const response = await fetch("http://localhost:5000/api/users", {
      method: "GET",
      headers: {
        "Authorization": "Basic " + btoa(`${email}:${password}`)
      }
    })

      if (response.ok) {
        const data = await response.json()
        // store user data in state
        setUser({ ...data, email, password }) 
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Sign in failed:", error)
      return false
    }
  }

  // Sign out method
  const signOut = () => {
    // clears the authenticated user
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}