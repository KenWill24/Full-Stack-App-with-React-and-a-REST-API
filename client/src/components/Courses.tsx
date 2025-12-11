import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Courses = () => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Error fetching courses:", err))
  }, [])

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/courses/create">Create Course</Link>
    </div>
  )
}

export default Courses