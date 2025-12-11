import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ValidationErrors from "./ValidationErrors";

const UpdateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      } catch (err) {
        setErrors(["Something went wrong loading the course"]);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrors(["Not authorized. Please sign in."]);
      return;
    }

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
    } catch (err) {
      console.error("Update failed:", err);
      setErrors(["Something went wrong"]);
    }
  };

  return (
    <div>
      <h2>Update Course</h2>

      <ValidationErrors errors={errors} />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label>Estimated Time</label>
          <input value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
        </div>

        <div>
          <label>Materials Needed</label>
          <textarea value={materialsNeeded} onChange={(e) => setMaterialsNeeded(e.target.value)} />
        </div>

        <button type="submit">Update Course</button>
      </form>
    </div>
  );
};

export default UpdateCourse;
