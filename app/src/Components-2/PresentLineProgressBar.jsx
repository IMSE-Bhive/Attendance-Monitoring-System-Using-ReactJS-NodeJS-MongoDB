import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";


export default function PresentLineProgressBar({ completed, total, getColor,getBaseBgColor }) {
//   if (!completed || !total) {
//     return null; 
//   }

  
  let bgColor='grey'
  // let getBaseBgColor='#9c9b9b3b'
  let progressPercentage = (completed / total) * 100;
  
  if(getColor){
    bgColor=getColor
  }

  return (
    <div className="progress-bar-container">
      <ProgressBar
        completed={progressPercentage}
        bgColor={bgColor}
        baseBgColor={getBaseBgColor}
        animateOnRender={true}
        isLabelVisible={false}
        height="7px"
       className="vertical-progress-bar"
      />
    </div>
  );
}
