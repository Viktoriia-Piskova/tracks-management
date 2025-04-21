import React from "react";

const Error = ({
  title = "An error occured",
  message = "Something went wrong",
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
};

export default Error;
