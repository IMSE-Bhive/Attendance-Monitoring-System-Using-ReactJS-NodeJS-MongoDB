import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ApplyTicket({state, cDate}) {
  const [team, setTeam] = useState('')
  const [priority, setPriority] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [description, setDescription] = useState('')

  const [ticketStatus, setTicketStatus] = useState([])
  const [refresh, setRefresh] = useState(true)

  // const ticketFun =  ()=>{
  //   axios.put('http://localhost:8081/ticketNo')
  //     .then(res=>{console.log(res);
  //       setTicketId(res.num)
  //       axios.post('http://localhost:8081/applyTicket',{emp_id:state.emp_id,name:state.name,ticketId:ticketId})
  //       .then(res1=>console.log(res1))
  //       .catch(err1=>console.log(err1))
  //     })
  //     .catch(err=>console.log(err))
  // }

  useEffect(()=>{
    axios.post('http://localhost:8081/getTicket',{emp_id:state.emp_id})
    .then(result=>{
      console.log(result.data)
      setTicketStatus(result.data)
    })
    .catch(err=>console.log(err))

  },[])

  const ticketFun = async () => {
    try {
      // Update ticket number
     

      // Apply for ticket
     ;


      if(team!=='' && priority!=='' &&  description!==''){
        const res = await axios.get('http://localhost:8081/ticketNo');
        // console.log(res.data);
        const newTicketId = `IS#${res.data.num.toString().padStart(3, '0')}`; 
        setTicketId(newTicketId);

        const res1 = await axios.post('http://localhost:8081/applyTicket', {
          emp_id: state.emp_id,
          name: state.name,
          ticketId: newTicketId,
          team, priority, description,
          date:cDate,
        });
        console.log(res1.data)
        setDescription('')
        setPriority('')
        setTeam('')
        setRefresh(!refresh)
        alert("Your Ticket has been submited successfully and your ticket Id is "+newTicketId)
      }
      else{
        alert("please fill all deatails")
      }
    } catch (err) {
      console.error('Error in ticketFun:', err);
    }
  };

  
  return (
    <>
        <div className="apply-ticket">
            <div className="apply-ticket-block">
                <h3>Raising New Ticket</h3>
                <div className="apply-ticket-block-content">
                  <div className="details">
                    <p>Name</p>
                    <p className='data'>{state?.name}</p>
                  </div> 
                  <div className="details">
                    <p>Email</p>
                    <p className='data'>{state?.emp_id}</p>
                  </div> 
                  <div className="details">
                    <p>Team</p>
                    <select name="" id="" value={team} onChange={e=>setTeam(e.target.value)}>
                      <option value=""> Select Team</option>
                      <option value="Team 1"> Team 1</option>
                      <option value="Team 2"> Team 2</option>
                      <option value="Team 3"> Team 3</option>
                    </select>
                  </div> 
                  <div className="details">
                    <p>Priority</p>
                    <select name="" id=""  value={priority} onChange={e=>setPriority(e.target.value)}>
                      <option value=""> Select Priority</option>
                      <option value="Low"> Low</option>
                      <option value="Normal"> Normal</option>
                      <option value="High"> High</option>
                    </select>
                  </div> 
                  {/* <div className="details span-2">
                    <p>Ticket Id</p>
                    <p className='data'>{`IS#${'001'.toString().padStart(3, '0')}`}</p>
                  </div> */}
                  <div className="details span-2">
                    <p>Description</p>
                    <textarea name="" id="" placeholder='Write a description about your query...' value={description} onChange={e=>setDescription(e.target.value)}></textarea>
                  </div>   
                </div>
                <button onClick={ticketFun}>Submit</button>
            </div>   
            <div className="ticket-status">
                <h3>Your Ticket status</h3>
                <div className="ticket-status-container">
                    {ticketStatus.length>0 && ticketStatus.map(item=>(
                      <div className="ticket-status-block">
                        <p>Ticket id {item.ticketId} is in progress</p>
                        <p className='ticket-date'>{item.date?.split('-').reverse().join('-').slice(0,-5) ??'-'}</p>
                      </div>
                    ))}
                    {!ticketStatus.length>0 && <p  style={{textAlign:'center', marginTop:'20px'}}>NO Result Found</p> }
                </div>
            </div>  

        </div>
    </>
  )
}

export default ApplyTicket