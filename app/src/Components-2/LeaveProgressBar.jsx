import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const LeaveProgressBar = ({ leaveData, type }) => {
    if (!leaveData) {
        return null; 
      }


console.log('----------------------------------------------');

const paidLeaveLength = leaveData.paid_leave ? leaveData.paid_leave.length : 0;
const unpaidLeaveLength = leaveData.unpaid_leave ? leaveData.unpaid_leave.length : 0;

let completed
let total
if(type==='balance'){
    console.log(leaveData);
   completed = leaveData?.balance_leave ?? 0
   total =  24;
}
else{
    completed = leaveData?.this_month_paidLeave?.length;
    total =  2+ leaveData?.earnedLeave
}

const percentage = total > 0 ? (completed / total) * 100 : 0;


    return (
        <div>
            <CircularProgressbar
                value={percentage}
                text={`${completed}  Days`}
                styles={buildStyles({
                    textColor: '#000',
                    pathColor: '#ff7c00',
                    trailColor: '#d6d6d',
                    textSize:'15px',
                    fontWeight: 'bold'
                })}
            />
        </div>
    );
};

export default LeaveProgressBar;
