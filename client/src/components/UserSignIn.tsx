import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import ValidationErrors from "./ValidationErrors"

// Component for signing in an existing user
const UserSignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState(null)

  // Access signIn function from authentication context
  const { signIn }  = useContext(AuthContext)
  const navigate = useNavigate()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Attempt to sign in with provided credentials
    const success = await signIn(email, password)
    if (success) {
      // redirect to homepage after successful sign in
      navigate("/")
    } else {
      // Show error message is sign in fails
      setErrors("Invalid email or password")
    }
  }

  // Render the sign in form
  return (
    <main> 
      <div className="form--centered"> 
        <h2>Sign In</h2> 

        <ValidationErrors errors={errors} />

        <form onSubmit={handleSubmit}> 
          <label htmlFor="emailAddress">Email Address</label> 
          <input 
            id="emailAddress" 
            name="emailAddress" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          /> 
          <label htmlFor="password">Password</label>
           <input 
             id="password" 
             name="password" 
             type="password" 
             value={password} 
             onChange={(e) => setPassword(e.target.value)} 
            /> 
           <button className="button" type="submit">Sign In</button> 
           <button
             className="button button-secondary" 
             type="button" onClick={() => navigate("/")} 
            > 
             Cancel 
            </button> 
           </form> 

           <p> Don't have a user account? Click here to{" "} 
            <Link to="/signup">sign up</Link>! 
          </p> 
        </div> 
      </main>
  );
};

export default UserSignIn