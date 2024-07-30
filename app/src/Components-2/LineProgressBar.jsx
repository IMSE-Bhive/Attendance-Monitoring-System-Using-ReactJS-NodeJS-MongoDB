import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";


export default function LineProgressBar({ completed, total }) {
  let progressPercentage
  if (!completed || !total) {
    progressPercentage=0 
  }
  else{
    const [hour, minute] = completed.split(":").map(Number);
    const progressInSeconds = (hour * 3600) + (minute * 60);

   progressPercentage = (progressInSeconds / (total * 3600)) * 100;
  }

  

  return (
    <div className="progress-bar-container">
      <ProgressBar
        completed={progressPercentage}
        bgColor="grey"
        animateOnRender={true}
        isLabelVisible={false}
        height="7px"
      />
    </div>
  );
}
