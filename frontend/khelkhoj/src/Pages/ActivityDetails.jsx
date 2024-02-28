import React from "react";
import { useParams } from "react-router-dom";

function ActivityDetails() {
  // Accessing the groundId from the route parameters
  let { activityId } = useParams();

  return (
    <div>
      <h2>Activity Details</h2>
      <p>Activity ID: {activityId}</p>
    </div>
  );
}

export default ActivityDetails;
