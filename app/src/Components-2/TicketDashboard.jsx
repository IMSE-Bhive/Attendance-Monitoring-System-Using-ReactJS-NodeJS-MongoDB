import axios from 'axios'
import React, { useEffect, useState } from 'react'

function TicketDashboard() {
    const [allTickets, setAllTickets] = useState([])
    const [table_class, setTableClass] = useState('')
    const [selectedTickets, setSelectedTickets] = useState({})
    const [refresh, setRefresh] = useState(true)
    useEffect(()=>{
        const getAllTickets = async ()=>{
            try {
               let result= await axios.get('http://localhost:8081/getAllTickets')
               setAllTickets(result.data)
            } catch (error) {
                console.log(error);
            }
        }
        getAllTickets()
    },[refresh])

    const updateTicketStatus = async (t_id)=>{
        try {
           let result= await axios.put('http://localhost:8081/updateTickets', {ticketId:t_id,status:'Resolved'})
           alert("Updated Successfully")
           setTableClass('');
           setSelectedTickets({});
           setRefresh(!refresh)
        } catch (error) {
            console.log(error);
        }
    }

    const selectedTicketFun = (item)=>{
         setSelectedTickets(item)
        console.log(item);
        setTableClass('hidden')

    }

  return (
    <>
        <div className="ticketDashboard">
            <div className="content-lable">
                {table_class==='hidden' && <button style={{
                                position: 'absolute', right: '10px', padding: '5px 10px', borderRadius: '5px',
                                outline: 'none', border: '1px solid #1e81ea'
                            }} onClick={() => {setTableClass('');
                                                setSelectedTickets({});

                            }}>Back</button>}
                <p><b>Support Tickets </b></p>
                <p>Employee<span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/ Tickets</span></p>
                <div className="ticket_table">
                    <table className={table_class}>
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Name</th>
                                <th>Emp ID</th>
                                <th>Team</th>
                                <th>Priority</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTickets.map(item=>(
                                <tr>
                                    <td>{item.ticketId}</td>
                                    <td>{item.name}</td>
                                    <td>{item.emp_id}</td>
                                    <td>{item.team}</td>
                                    <td>{item.priority}</td>
                                    <td>{item.description?.slice(0,30)}</td>
                                    <td>{item.status}</td>
                                    <td><button onClick={()=>selectedTicketFun(item)}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {table_class!=='' && 
                        <div >
                            
                        <div className='content'>
                            <div className='block grid-2' >
                                <p className='block-heading'>Ticket ID</p>
                                <p className='block-data'>{selectedTickets?.ticketId}</p>
                            </div>
                            <div className='block ' >
                                <p className='block-heading'>Name</p>
                                <p className='block-data'>{selectedTickets?.name}</p>
                            </div>
                            <div className='block' >
                                <p className='block-heading'>Employee ID</p>
                                <p className='block-data'>{selectedTickets?.emp_id}</p>
                            </div>
                            <div className='block' >
                                <p className='block-heading'>Team</p>
                                <p className='block-data'>{selectedTickets?.team}</p>
                            </div>
                            <div className='block' >
                                <p className='block-heading'>Priority</p>
                                <p className='block-data'>{selectedTickets?.priority}</p>
                            </div>
                            <div className='block grid-2' >
                                <p className='block-heading'>Description</p>
                                <p className='block-data' style={{width:'80%'}}>{selectedTickets.description}</p>
                            </div>
                            
                        </div>
                        <button id='resolve' onClick={()=>updateTicketStatus(selectedTickets.ticketId)}>Resolved</button>
                        </div>
                        
                    }

                </div>
            </div>
        </div>
    </>
  )
}

export default TicketDashboard