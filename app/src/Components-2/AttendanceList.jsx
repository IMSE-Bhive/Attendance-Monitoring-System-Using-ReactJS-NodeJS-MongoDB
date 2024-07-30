import React from 'react'

function AttendanceList({ data }) {
    return (
        <>
            <div className="emp-attendance-list">
                <div className="attendance-list">
                    <p className='block-heading' > <b>Attendance List</b></p>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ borderLeft: 'none' }}>S.No</th>
                                <th>Date</th>
                                <th>Punch In</th>
                                <th>Punch Out</th>
                                <th>Production</th>
                                <th>Break</th>
                                <th style={{ borderRight: 'none' }}>Overtime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.reverse().map((item, key) => (
                                <tr key={key}>
                                    <td style={{ borderLeft: 'none' }}>{key + 1}</td>
                                    <td>{item.date}</td>
                                    <td>{item.login}</td>
                                    <td>{item.logout}</td>
                                    <td>{item.duration}</td>
                                    <td> 1 hour</td>
                                    <td style={{ borderRight: 'none' }}>0 hour</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default AttendanceList