import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [errors, setErrors] = useState([]);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error("Error fetching course:", err));
  }, [id]);

    const handleDelete = async () => {
    if (!user) return
    try {
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
    } catch (err) {
      setErrors("Something went wrong")
    }
  }

  return (
    <div>
      {errors && <p style={{ color: "red" }}>{errors}</p>}
      {course ? (
        <>
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          {/* ✅ Only show if current user owns the course */}
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