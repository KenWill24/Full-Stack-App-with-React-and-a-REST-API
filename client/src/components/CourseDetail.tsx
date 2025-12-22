import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ReactMarkdown from "react-markdown";

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
      .catch(() => setErrors(["Error fetching course"]));
  }, [id]);

  // Handle deleting the course
  const handleDelete = async () => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + btoa(`${user.email}:${user.password}`)
        }
      });

      if (res.status === 204) {
        navigate("/");
      } else {
        setErrors(["Failed to delete course"]);
      }
    } catch {
      setErrors(["Something went wrong"]);
    }
  };

  // Render course details
  return (
    <main>
      {/* Action buttons */}
      <div className="actions--bar">
        <div className="wrap">
          {user && user.id === course?.userId && (
            <>
              <Link to={`/courses/${id}/update`} className="button">
                Update Course
              </Link>
              <button className="button" onClick={handleDelete}>
                Delete Course
              </button>
            </>
          )}
          <Link to="/" className="button button-secondary">
            Return to List
          </Link>
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
                <p>
                  By {course.user?.firstName} {course.user?.lastName}
                </p>

                {/* Render description as Markdown */}
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>

              {/* Right column: time and materials */}
              <div>
                <h3 className="course--detail--title">Estimated Time</h3>
                <p>{course.estimatedTime}</p>

                <h3 className="course--detail--title">Materials Needed</h3>

                {/* Render materials as Markdown */}
                <ReactMarkdown
                  components={{
                    ul: ({ node, ...props }) => (
                      <ul className="course--detail--list" {...props} />
                    ),
                  }}
                >
                  {course.materialsNeeded}
                </ReactMarkdown>
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

export default CourseDetail;