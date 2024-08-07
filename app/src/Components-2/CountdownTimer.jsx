import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CountdownTimer = ({ durationCompleted , path_color}) => {
    const [remainingTime, setRemainingTime] = useState(durationCompleted);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         const [hours, minutes] = remainingTime.split(':').map(Number);
    //         if (hours === 0 && minutes === 0) {
    //             clearInterval(timer);
    //         } else {
    //             const totalSeconds = hours * 3600 + minutes * 60 - 1;
    //             const newHours = Math.floor(totalSeconds / 3600);
    //             const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    //             setRemainingTime(`${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`);
    //         }
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [durationCompleted]);

    const totalTime = '09:00'; // Total duration of 9 hours

    // Calculate percentage completion based on durationCompleted
    const totalSeconds = 9 * 3600; // Total seconds in 9 hours
    
    const completedSeconds = durationCompleted.split(':').reduce((acc, time, idx) => acc + parseInt(time) * (idx === 0 ? 3600 : 60), 0);
    let trColor='#d6d6d6'
   
    let percentage = (completedSeconds / totalSeconds) * 100;
    if(completedSeconds>=totalSeconds){
        trColor=path_color
        percentage = ((completedSeconds - totalSeconds) / totalSeconds) * 100;
        path_color='#18404f'
    }

    return (
        <div>
            <CircularProgressbar
                value={percentage}
                text={`${durationCompleted}hr `}
            
                styles={buildStyles({
                    textColor: '#000',
                    pathColor: path_color,
                    trailColor: trColor,
                })}
            />
        </div>
    );
};

export default CountdownTimer;
