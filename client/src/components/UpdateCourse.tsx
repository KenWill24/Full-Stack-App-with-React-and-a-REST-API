import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import ValidationErrors from "./ValidationErrors"

// Component for updating an existing course
const UpdateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);

  // Get course ID from URL params and user info from context
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch course data when component mounts
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setDescription(data.description);
          setEstimatedTime(data.estimatedTime || "");
          setMaterialsNeeded(data.materialsNeeded || "");
        } else {
          setErrors(["Failed to load course details"]);
        }
      } catch {
        setErrors(["Something went wrong loading the course"]);
      }
    };
    fetchCourse();
  }, [id]);

  // Handle form submission to update the course
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user is signed in before submitting
    if (!user) {
      setErrors(["Not authorized. Please sign in."]);
      return;
    }

    // Send PUT request to API to update course
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${user.email}:${user.password}`),
        },
        body: JSON.stringify({
          title,
          description,
          estimatedTime,
          materialsNeeded,
          userId: user.id,
        }),
      });

      if (res.status === 204) {
        navigate(`/courses/${id}`);
      } else if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors);
      } else {
        const data = await res.json();
        setErrors([data.message || "Failed to update course"]);
      }
    } catch {
      console.error("Update failed:");
      setErrors(["Something went wrong"]);
    }
  };

  // Render the update course form
  return (
  <main> 
    <div className="wrap">
      <h2>Update Course</h2> 

      <ValidationErrors errors={errors} />

      <form onSubmit={handleSubmit}>
        <div className="main--flex"> 
          <div>
            <label htmlFor="courseTitle">Course Title</label> 
            <input 
              id="courseTitle" 
              name="courseTitle" 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            /> 
            <p>By {user?.firstName} {user?.lastName}</p>

            <label htmlFor="courseDescription">Course Description</label> 
            <textarea 
              id="courseDescription"
              name="courseDescription" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            /> 
          </div> 

          <div> 
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input 
              id="estimatedTime" 
              name="estimatedTime" 
              type="text" 
              value={estimatedTime} 
              onChange={(e) => setEstimatedTime(e.target.value)}
            />

            <label htmlFor="materialsNeeded">Materials Needed</label>
            <textarea 
              id="materialsNeeded" 
              name="materialsNeeded" 
              value={materialsNeeded} 
              onChange={(e) => setMaterialsNeeded(e.target.value)} 
             /> 
           </div> 
          </div> 

          <button className="button" type="submit">Update Course</button>
          <button 
            className="button button-secondary" 
            type="button" 
            onClick={() => navigate("/")}
          > 
            Cancel 
          </button> 
         </form> 
        </div> 
       </main> 
     ); 
    };

export default UpdateCourse;