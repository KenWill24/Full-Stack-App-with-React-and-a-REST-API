import Header from "./components/Header"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute";
import Courses from "./components/Courses"
import CourseDetail from "./components/CourseDetail"
import UserSignIn from "./components/UserSignIn"
import UserSignUp from "./components/UserSignUp"
import CreateCourse from "./components/CreateCourse"
import UpdateCourse from "./components/UpdateCourse"


function App() {



  return (
    <>
    <Router>
     <Header />
     <Routes>
      {/* Route for homepage + courses*/}
      <Route path="/" element={<Courses />} />
      {/* Course detail by ID */}
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/signin" element={<UserSignIn />} />
      <Route path="/signup" element={<UserSignUp />} />
      {/* Auth-Protected Routes*/}
      <Route element={<PrivateRoute />} />
      <Route path="/courses/create" element={<CreateCourse />} />
      <Route path="/courses/:id/update" element={<UpdateCourse />} /> 

     </Routes>
    </Router>
    </>
  )
}

export default App