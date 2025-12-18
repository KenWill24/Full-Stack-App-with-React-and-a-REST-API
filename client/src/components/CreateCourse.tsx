import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import ValidationErrors from "./ValidationErrors"

// Component for creating a new course
const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);

  // Access the currently signed in user from context
  const { user } = useContext(AuthContext); 

  // Hook for navigation after form submission
  const navigate = useNavigate()

  // Handle form submission to create a new course
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setErrors([])

  //If no user is signed in, block course creation
  if (!user) {
    setErrors(["You must be signed in to create a course."])
    return
  }

  try {
    // Send POST request to API to create a new course
    const res = await fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(`${user.email}:${user.password}`)
      },
      body: JSON.stringify({
        title,
        description,
        estimatedTime,
        materialsNeeded,
        userId: user.id
      })
    })

    if (res.status === 201) {
      // Only parse JSON if there is a body
      const text = await res.text()
      if (text) {
        const data = JSON.parse(text)
        navigate(`/courses/${data.id}`)
      } else {
        // If no body, just redirect to courses list
        navigate("/")
      }
      return
    }

    if (res.status === 400) {
      const payload = await res.json()
      setErrors(payload.errors || ["Validation failed"])
    } else {
      const payload = await res.json().catch(() => null)
      setErrors([(payload?.message) || `Request failed with status ${res.status}`])
    }
  } catch {
    setErrors(["Network error. Please try again."])
  }
}


// Render the create course form
  return (
  <main>
    <div className="wrap">
      <h2>Create Course</h2>

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

                <button className="button" type="submit">Create Course</button> 
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
export default CreateCourse