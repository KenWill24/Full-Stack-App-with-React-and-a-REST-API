import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../AuthContext"

const Header = () => {
  const { user, signOut } = useContext(AuthContext)

  return (
    <header>
      <h1>School Database App</h1>
      <nav>
        <Link to="/">Courses</Link>{" "}
        {user ? (
          <>
            <span>Welcome, {user.firstName} {user.lastName}</span>{" "}
            <button onClick={signOut}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>{" "}
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
