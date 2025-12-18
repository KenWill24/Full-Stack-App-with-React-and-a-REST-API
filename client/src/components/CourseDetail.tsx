import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

// Component for displaying details of a single course
const CourseDetail = () => {
  // Get course ID from the URL
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [errors, setErrors] = useState([]);

  // Access the currently signed in user from context
  const { user } = useContext(AuthContext);

  // Hook for navigation -- used after deleting a course
  const navigate = useNavigate();

  // Fetch course details when component mounts or when ID changes
  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(() => setErrors("Error fetching course:"));
  }, [id]);

  // Handle deleting the course
    const handleDelete = async () => {

    // Only allow delete if user is signed in
    if (!user) return
    try {
      // Send Delete request to API to delete course
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Basic " + btoa(`${user.email}:${user.password}`)
        }
      })
      if (res.status === 204) {
        navigate("/")   // redirect after delete
      } else {
        setErrors("Failed to delete course")
      }
    } catch {
      setErrors("Something went wrong")
    }
  }

  // Render course details
  return (
    <div>
      {errors && <p style={{ color: "red" }}>{errors}</p>}
      {course ? (
        <>
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <h2>Estimated Time</h2>
          <p>{course.estimatedTime}</p>

          <h2>Materials Needed</h2>
          <p>{course.materialsNeeded}</p>

          {/* Only show if current user owns the course */}
          {user && user.id === course.userId && (
            <div className="course-actions">
              <Link to={`/courses/${id}/update`} className="btn">Update Course</Link>
              <button className="btn delete" onClick={handleDelete}>
                Delete Course
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading course...</p>
      )}
    </div>
  )
}

export default CourseDetail