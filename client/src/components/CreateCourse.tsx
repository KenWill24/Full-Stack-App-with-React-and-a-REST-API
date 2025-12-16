import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import ValidationErrors from "./ValidationErrors"


const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);


  const { user } = useContext(AuthContext); 

  const navigate = useNavigate()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setErrors([])

  if (!user) {
    setErrors(["You must be signed in to create a course."])
    return
  }

  try {
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
      // ✅ Only parse JSON if there is a body
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


  return (
    <div>
      <h2>Create Course</h2>

        <ValidationErrors errors={errors} />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Estimated Time</label>
          <input
            type="text"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
          />
        </div>

        <div>
          <label>Materials Needed</label>
          <textarea
            value={materialsNeeded}
            onChange={(e) => setMaterialsNeeded(e.target.value)}
          />
        </div>

        <button type="submit">Create Course</button>
         <button
            type="button"
            className="cancel"
            onClick={() => navigate("/")}
          >
          Cancel
        </button>
        
      </form>


    </div>
  )
}

export default CreateCourse