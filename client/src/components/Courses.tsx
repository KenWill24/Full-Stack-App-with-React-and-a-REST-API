import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// Component for displaying the list of all courses
const Courses = () => {
  const [courses, setCourses] = useState([])

  // Fetch courses from the API when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Error fetching courses:", err))
  }, [])

  // Render the courses
  return (
 <main>
   <div className="wrap main--grid"> 
    {courses.map((course) => ( 
      <Link 
      to={`/courses/${course.id}`} 
      className="course--module course--link" 
      key={course.id} 
      >
         <h2 className="course--label">Course</h2> 
         <h3 className="course--title">{course.title}</h3> 
        </Link> 
      ))} 
      
      <Link to="/courses/create" className="course--module course--add--module">
       <span className="course--add--title">
         <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 13 13" 
          className="add" 
          > 
            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6" /> 
          </svg>
           New Course 
          </span>
        </Link> 
      </div> 
    </main> 
  ); 
};

export default Courses