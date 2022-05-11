const AccessDenied = (props) => {
  return (
    <div className="main-content">
      <h2 className="title">Access Denied</h2>
      <p className="msg">
        {props.message || "You must be signed in to view this page."}
      </p>
    </div>
  );
};

export default AccessDenied;
