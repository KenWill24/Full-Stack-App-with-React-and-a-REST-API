const ValidationErrors = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

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