import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

// Component for header
const Header = () => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <header className="header--flex">
      <div className="header--logo">
        <Link to="/">Courses</Link>
      </div>
      <nav>
        <ul className={user ? "header--signedin" : "header--signedout"}>
          {user ? (
            <>
              <li>Welcome, {user.firstName} {user.lastName}</li>
              <li>
                <button onClick={signOut}>Sign Out</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/signin">Sign In</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;