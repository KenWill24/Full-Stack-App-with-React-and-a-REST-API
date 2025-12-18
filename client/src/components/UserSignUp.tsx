import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import ValidationErrors from "./ValidationErrors"
import { Link } from "react-router-dom"

// Component for registering a new user
const UserSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  // Access signIn function from the authentication context
  const { signIn } = useContext(AuthContext)
  const navigate = useNavigate()

  // Handle form submission to create a new user
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Send POST request to API to create a new user
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
      await signIn(email,password);
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

// Render the sign up form
  return (
   <main>
    <div className="form--centered">
      <h2>Sign Up</h2>

      <ValidationErrors errors={errors} />

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

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

        <button className="button" type="submit">Sign Up</button>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    <p>
      Already have a user account? Click here to{" "}
      <Link to="/signin">sign in</Link>!
    </p>
  </div>
</main>
  )
}

export default UserSignUp