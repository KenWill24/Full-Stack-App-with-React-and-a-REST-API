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
    <main> 
      {/* Action buttons */} 
      <div className="actions--bar"> 
        <div className="wrap"> 
          {user && user.id === course?.userId && ( 
            <> 
            <Link to={`/courses/${id}/update`} className="button">Update Course</Link>
            <button className="button" onClick={handleDelete}>Delete Course</button> 
          </> 
        )} 
        <Link to="/" className="button button-secondary">Return to List</Link> 
       </div> 
      </div> 
      {/* Course content */} 
     <div className="wrap"> 
      <h2>Course Detail</h2> 
      {errors.length > 0 && ( 
        <p style={{ color: "red" }}>{errors.join(", ")}</p> 
      )} 
      {course ? ( 
        <form> 
          <div className="main--flex"> 
            {/* Left column: title and description */}
            <div> 
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4> 
              <p>By {course.user?.firstName} {course.user?.lastName}</p> 

              {course.description 
                .split("\n") 
                .map((para, i) => <p key={i}>{para}</p>)} 
            </div>
            {/* Right column: time and materials */} 
            <div> 
              <h3 className="course--detail--title">Estimated Time</h3> 
              <p>{course.estimatedTime}</p> 

              <h3 className="course--detail--title">Materials Needed</h3> 
              <ul className="course--detail--list"> 
                {course.materialsNeeded 
                  .split("*") 
                  .map((item, i) => 
                    item.trim() ? <li key={i}>{item.trim()}</li> : null
                  )} 
              </ul>
            </div>
          </div>
        </form> 
      ) : ( 
        <p>Loading course...</p> 
      )}
    </div> 
  </main>
 ); 
};


export default CourseDetail