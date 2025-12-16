import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"

const UserSignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState(null)

  const { signIn }  = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await signIn(email, password)
    if (success) {
      // redirect to homepage after successful sign in
      navigate("/")
    } else {
      setErrors("Invalid email or password")
    }
  }

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign In</button>
        <button
            type="button"
            className="cancel"
            onClick={() => navigate("/")}
          >
          Cancel
        </button>
      </form>

      {errors && <p style={{ color: "red" }}>{errors}</p>}
    </div>
  )
}

export default UserSignIn