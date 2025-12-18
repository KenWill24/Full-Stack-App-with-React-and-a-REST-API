// Component for displaying validation error messages
const ValidationErrors = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  // Render a container with a heading and list of error messages
  return (
    <div className="validation--errors">
      <h3>Validation Errors</h3>
      <ul>
        {errors.map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationErrors;