import axios from 'axios'
import React, { useEffect, useState } from 'react'

function EmployeeList() {
    const [empList, setEmplist] = useState([])
    const [dates, setDates] = useState([])

    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const datesArray = [];
        for (let d = firstDayOfMonth; d <= today; d.setDate(d.getDate() + 1)) {
            datesArray.push(new Date(d).toISOString().split('T')[0]);
        }

        setDates(datesArray);

        // Fetch attendance data
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/getUser')
            .then((result) => {
                // console.log(result.data)
                setEmplist(result.data)
            })
            .catch(err => console.log(err))

    }, [])
    console.log(dates);
    return (
        <>
            <div className="employeeList">
                <div className="employee-list-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                {dates.map(date => (
                                    <th key={date}>{date}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default EmployeeList

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// function EmployeeList() {
//     const [empList, setEmplist] = useState([]);
//     const [dates, setDates] = useState([]);
//     const [attendance, setAttendance] = useState([]);

//     useEffect(() => {
//         const today = new Date();
//         const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//         const datesArray = [];
//         for (let d = firstDayOfMonth; d <= today; d.setDate(d.getDate() + 1)) {
//             datesArray.push(new Date(d).toISOString().split('T')[0]);
//         }

//         setDates(datesArray);
//     }, []);

//     useEffect(() => {
//         axios.get('http://localhost:8081/getUser')
//             .then((result) => {
//                 setEmplist(result.data);
//             })
//             .catch(err => console.log(err));
//     }, []);

//     useEffect(() => {
//         axios.get('http://localhost:8081/getAttendance')
//             .then((result) => {
//                 setAttendance(result.data);
//             })
//             .catch(err => console.log(err));
//     }, []);

//     const getAttendanceForDate = (employeeId, date) => {
//         const record = attendance.find(
//             entry => entry.employeeId === employeeId && entry.date === date
//         );
//         return record ? record.status : 'N/A';
//     };

//     return (
//         <>
//             <div className="employeeList">
//                 <div className="employee-list-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Employee</th>
//                                 {dates.map(date => (
//                                     <th key={date}>{date}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
                            
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default EmployeeList;
