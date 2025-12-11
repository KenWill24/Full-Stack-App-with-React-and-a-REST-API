import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import ValidationErrors from "./ValidationErrors"


const UserSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);


  const { signIn } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        emailAddress: email,
        password
      }),
    });

    if (response.status === 201) {
      navigate("/signin");
    }

    else if (response.status === 400) {
      const errData = await response.json();
      setErrors(errData.errors);
    }

    else {
      const errData = await response.json();
      setErrors([errData.message || "Failed to sign up"]);
    }

  } catch (err) {
    console.error("Sign-up error:", err);
    setErrors(["Something went wrong"]);
  }
};

  return (
    <div>
      <h2>Sign Up</h2>

        <ValidationErrors errors={errors} />

      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit">Sign Up</button>
      </form>


    </div>
  )
}

export default UserSignUp
