// import React from 'react'

// function AdminDashboard() {
//     return (
//         <>
//             <div className="admin-dashboard">
//                 <div className="header">
//                     header
//                 </div>
//                 <div className="side-bar">

//                 </div>
//                 <div className="content-section">

//                     <div className="content-lable">

//                     </div>
//                     <div className="section-1">
//                         <div className="container">

//                         </div>
//                         <div className="container">

//                         </div>
//                         <div className="container">

//                         </div>
//                     </div>
//                     <div className="section-2">
//                         <div className="attendance-list">

//                         </div>
//                         <div className="daily-records">
                            
//                         </div>

//                     </div>

//                 </div>

//             </div>
//         </>
//     )
// }

// export default AdminDashboard


import React from 'react'
import { useLocation } from 'react-router-dom';

function AdminDashboard() {

    return (
        <>
            <div className="admin-dashboard">
                <div className="header">
                    header
                </div>
                <div className="section">
                    <div className="side-bar">

                    </div>
                    <div className="content-section">

                        <div className="content-lable">

                        </div>
                        <div className="section-1">
                            <div className="container">

                            </div>
                            <div className="container">

                            </div>
                            <div className="container">

                            </div>
                        </div>
                        <div className="section-2">
                            <div className="attendance-list">

                            </div>
                            <div className="daily-records">

                            </div>

                        </div>

                    </div>
                </div>


            </div>
        </>
    )
}

export default AdminDashboard