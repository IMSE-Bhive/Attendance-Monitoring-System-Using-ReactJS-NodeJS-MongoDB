import React, { useEffect, useState } from 'react'
import './LandingDashboard.css'
import logo from '../Assets/immensphereLogo.png'
import workLogo from '../Assets/workingLog.png'
import sunIcon from '../Assets/day-sunny-icon.png'
import circle2 from '../Assets/circle2.png'
import userLogo from '../Assets/userLogo.png'
import LeaveProgressBar from './LeaveProgressBar'
import Calender from './Calender'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import CountdownTimer from './CountdownTimer'
import HolidaysList from './HolidaysList'
import EmpLeaveSection from './EmpLeaveSection'
import Policy from './Policy'
import ApplyLeave from './ApplyLeave'
import ApplyTicket from './ApplyTicket'
import io from 'socket.io-client';



function LandingDashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location;
    const emp = state?.emp
    console.log(state)
    const [leave, setLeave] = useState({});
    const [attendance, setAttendance] = useState([]);
    const [leaveCollection, setLeaveCollection] = useState({});
    const [applyLeave, setApplyLeave] = useState([]);
    const [empLeave, setEmpLeave] = useState([])

    const [swipeInBtn, setSwipeInBtn] = useState(true);
    const [swipeInTime, setSwipeInTime] = useState('');
    const [swipeOutTime, setSwipeOutTime] = useState('');
    const [duration, setDuration] = useState('0:0');
    const [overTime, setOverTime] = useState('0 hour');
    const [weekProgress, setWeekProgress] = useState('');
    const [monthProgress, setMonthProgress] = useState('');
    const [overTimeProgress, setOverTimeProgress] = useState('');

    const [side_bar_class, setSideBarClass] = useState('side-bar visible');
    const [content_section_class, setContentSectionClass] = useState('content-section with-side-bar');
    const [sideBarStatus, setSideBarStatus] = useState(false);
    const [account_section_class, setAccountSectionClass] = useState('hidden')
    const [notification_class, setNotificationClass] = useState('hidden')
    const [switch_acc_class, setSwitchAccClass] = useState('hidden')
    const [attendance_history_class, setAttendance_history_class] = useState('attendance-history hidden')

    const [displayValue, setDisplayValue] = useState(['visible', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden'])
    //const [displayValue, setDisplayValue] = useState(['hidden', 'hidden','visible', 'hidden', 'hidden', 'hidden'])
    const nationalHolidays = [
        { datee: '2024-01-01', name: "New Year" },
        { date: '2024-01-26', name: 'Republic Day' },
        { date: '2024-03-25', name: 'Holi' },
        { date: '2024-06-17' },
        { date: '2024-08-15', name: 'Independence Day' },
        { date: '2024-10-02', name: 'Gandhi Jayanti' },
        { date: '2024-10-12', name: 'Dussehra' },
        { date: '2024-11-01', name: 'Diwali' },
        { date: '2024-12-25', name: 'Christmas Day' },
    ];

    const getUpcomingHoliday = (holidays) => {
        const today = new Date();
        let upcomingHoliday = null;

        holidays.forEach(holiday => {
            const holidayDate = new Date(holiday.date);
            if (holidayDate > today) {
                if (!upcomingHoliday || holidayDate < new Date(upcomingHoliday.date)) {
                    upcomingHoliday = holiday;
                }
            }
        });

        return upcomingHoliday;
    };

    const [upcomingHoliday, setUpcomingHoliday] = useState(null);



    useEffect(() => {
        const holiday = getUpcomingHoliday(nationalHolidays);
        setUpcomingHoliday(holiday);
    }, []);


    const sideBarFun = () => {
        setSideBarClass(sideBarStatus ? 'side-bar hidden' : 'side-bar visible');
        setContentSectionClass(sideBarStatus ? 'content-section' : 'content-section with-side-bar');
        setSideBarStatus(!sideBarStatus);
    };

    const [selected, setSelected] = useState(0);
    const [greetingMSG, setGreetingMSG] = useState('Hello')
    useEffect(() => {
        let t = date.getHours()
        console.log(t);
        if (t < 6)
            setGreetingMSG('Night')
        else if (t < 12)
            setGreetingMSG('Morning')
        else if (t < 17)
            setGreetingMSG('Afternoon')
        else if (t < 19)
            setGreetingMSG('Evening')
        else
            setGreetingMSG('Night')
    }, [greetingMSG])

    const handleClick = (index) => {
        setSelected(index);
        setDisplayValue(displayValue.map((value, i) => (i === index ? 'visible' : 'hidden')))
    };

    useEffect(() => {
        // axios.post('http://localhost:8081/getEmployee' ,{emp_id:id})
        //     .then((result) => {
        //         console.log(result.data);
        //         setUser(result.data);
        //     })
        //     .catch(err => console.log(err));

        axios.post('http://localhost:8081/getAttendance', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data);
                setAttendance(result.data);
            })
            .catch(err => console.log(err));

        axios.post('http://localhost:8081/getLeaveStatus', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data)
                setEmpLeave(result.data)
            })
            .catch(err => console.log(err))

        axios.post('http://localhost:8081/getLeave', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data);
                setLeaveCollection(result.data);
            })
            .catch(err => console.log(err));

        axios.post('http://localhost:8081/getProgress', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data);
                setWeekProgress(result.data.week)
                setMonthProgress(result.data.month)
                setOverTimeProgress(result.data.overTime)
            })
            .catch(err => console.log(err));


    }, [state]);

    // useEffect(()=>{

    // },[id])


    const [currentTime, setCurrentTime] = useState('');
    // const[currentDate, setCurrentDate] = useState('')
    const date = new Date();
    let monthDate = (date.getMonth() + 1).toString().padStart(2, '0');
    let dayDate = date.getDate().toString().padStart(2, '0');
    let currentDate = `${date.getFullYear()}-${monthDate}-${dayDate}`;

    // useEffect(() => {
    //     let date = new Date();
    //     let hour = date.getHours();
    //     let meridiem = hour < 12 ? 'AM' : 'PM';
    //     let formattedHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    //     setCurrentTime(`${formattedHour}:${String(date.getMinutes()).padStart(2, '0')} ${meridiem}`);
    // },[currentTime]);

    useEffect(() => {
        const updateCurrentTime = () => {
            let date = new Date();
            let hour = date.getHours();
            let meridiem = hour < 12 ? 'AM' : 'PM';
            let formattedHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            setCurrentTime(`${formattedHour}:${String(date.getMinutes()).padStart(2, '0')} ${meridiem}`);
        };

        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (attendance.length > 0) {
            console.log(attendance.length);
            const recent = attendance[0];


            if (currentDate === recent.date) {
                setSwipeInTime(recent.login);
                setSwipeOutTime(recent.logout);
                setSwipeInBtn(false);
            }
        }
        console.log(swipeInTime);
    }, [attendance]);

    const updateLogin = () => {
        axios.post('http://localhost:8081/createAttendance', { emp_id: state.emp_id, date: currentDate, login: currentTime, logout: '' })
            .then((result) => {
                if (!result.data.message) {
                    alert("Swipe In Successfully");
                    setSwipeInTime(result.data.login);
                    setSwipeInBtn(false);
                    if (!result.data.error) {
                        axios.put('http://localhost:8081/updateDays', { emp_id: state.emp_id, date: currentDate, action: "swipeIn" })
                            .then((result1) => {
                                console.log(result1.data);
                            })
                            .catch((err1) => {
                                console.error('Error updating working days:', err1);
                            });
                    }
                } else {
                    alert("Already Swiped In");
                }
            })
            .catch(err => console.log(err));
    }

    const loginFun = () => {
        let date = new Date()
        let [presentHour, presentMinute] = [date.getHours(), date.getMinutes()].map(Number)
        console.log(date);
        console.log(presentHour);
        console.log(presentMinute);
        if (presentHour < 9) {
            alert("You not suppose to login Early")
        } else {
            updateLogin()
        }
    }

    const convertToMiliSeconds = (str) => {
        let [strHour, strMinute] = str.split(':').map(Number)
        return (strHour * 3600) + (strMinute * 60)
    }
    const convertToHour = (num) => {
        let h = Math.floor(num / (60 * 60))
        let m = Math.floor((num % (60 * 60)) / (60))
        return `${h}:${m}`
    }
    const progressFun = (w, m, o) => {
        axios.put('http://localhost:8081/updateProgress', { emp_id: state.emp_id, week: w, month: m, overTime: o })
            .then((result) => {
                console.log(result.data)
            })
            .catch(err => console.log(err))

    }
    const updateProgress = () => {
        let [dHour, dMinute] = duration.split(':').map(Number)
        let todayHour, todayOverTime
        if (dHour < 9) {
            todayHour = convertToMiliSeconds(duration)
            todayOverTime = 0
        } else {
            todayHour = 9 * 3600
            todayOverTime = convertToMiliSeconds(duration) - (9 * 3600)
        }
        console.log("todayHour - " + todayHour);
        console.log("todayMinute - " + todayOverTime);

        let totalWeekMs = weekProgress ? convertToMiliSeconds(weekProgress) + todayHour : todayHour
        let totalMonthMs = convertToMiliSeconds(monthProgress) + todayHour
        let totalOverTimeMs = convertToMiliSeconds(overTimeProgress) + todayOverTime

        // console.log(duration);
        // console.log(totalWeekMs);
        // console.log(totalMonthMs);
        // console.log(totalOverTimeMs);

        let totalWeekHour = convertToHour(totalWeekMs)
        let totalMonthHour = convertToHour(totalMonthMs)
        let totalOverTimeHour = convertToHour(totalOverTimeMs)
        console.log('updating progress--------------------------------');
        progressFun(totalWeekHour, totalMonthHour, totalOverTimeHour)
        // console.log(totalWeekHour);
        // console.log(totalMonthHour);
        // console.log(totalOverTimeHour);
    }

    const updateLogout = () => {
        axios.put('http://localhost:8081/updateLogout', { emp_id: state.emp_id, date: currentDate, logout: currentTime, duration: duration, overTime: overTime })
            .then((result) => {
                console.log(result.data)
                alert("Today you done a Great Job...")
                setSwipeInBtn(true)
                setSwipeOutTime(currentTime)
                updateProgress()
            })
            .catch(err => console.log(err))
    }
    const logoutFun = () => {
        if (!swipeOutTime) {
            const [totalHour, totalMinute] = duration.split(':').map(Number);
            console.log(totalHour + "---" + totalMinute);
            if (totalHour < 9) {
                let enterValue = window.confirm('Are you sure you want to swipe out early?');
                if (enterValue) {
                    updateLogout()
                    console.log("logout Successgully");
                }
            } else {
                updateLogout()
                console.log("logout Successgully");
            }
        } else {
            alert("You Already Swipe Out Successfully")
        }

    }

    useEffect(() => {
        if (!swipeInTime) return;

        const [loginHour, loginMinute] = swipeInTime.split(' ')[0].split(':').map(Number);
        const loginMeridiem = swipeInTime.split(' ')[1];
        const currentTimeToUse = swipeOutTime ? swipeOutTime : currentTime;
        const [currentHour, currentMinute] = currentTimeToUse.split(' ')[0].split(':').map(Number);
        const currentMeridiem = currentTimeToUse.split(' ')[1];

        const loginDate = new Date();
        loginDate.setHours(loginMeridiem === 'PM' && loginHour !== 12 ? loginHour + 12 : (loginHour === 12 && loginMeridiem === 'AM' ? 0 : loginHour));
        loginDate.setMinutes(loginMinute);

        const curDate = new Date();
        curDate.setHours(currentMeridiem === 'PM' && currentHour !== 12 ? currentHour + 12 : currentHour);
        curDate.setMinutes(currentMinute);

        const calculateDuration = () => {
            console.log(curDate);
            console.log(loginDate);
            const durationMs = curDate - loginDate;
            const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
            const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            setDuration(`${durationHours}:${String(durationMinutes).padStart(2, '0')}`);
            console.log(`${durationHours} hours, ${durationMinutes} minutes`);

            if (durationHours >= 9) {
                calculateOverTime(durationHours, durationMinutes);
            }
        };

        const calculateOverTime = (durationHours, durationMinutes) => {
            const overHours = durationHours - 9;
            const overMinutes = durationMinutes;

            console.log(`Overtime: ${overHours}:${overMinutes} hour`);
            setOverTime(`${overHours}:${overMinutes} hour`)
        };

        calculateDuration();
    }, [swipeInTime, swipeOutTime, currentTime]);

    const switchFun = () => {
        navigate(`/empDashboard`, { state })
    }

    const [meetingList, setMeetingList] = useState([])
    const [ticketList, setTicketList] = useState([])
    useEffect(() => {
        if (!state || !state.emp_id) return; // Ensure state and emp_id are available

        const fetchMeetingList = async () => {
            try {
                const result = await axios.get('http://localhost:8081/getMeeting');
                setMeetingList(result.data);
            } catch (error) {
                console.error("Error while getting meetings data:", error);
                // console.log("Eorror @@@@@@@@@@@@@@@@@@@@@");
            }
        };



        fetchMeetingList();


    }, [state]);

    const upcomingMeetings = meetingList
        .filter((f) => new Date(f.mDate) >= new Date(currentDate))
        .filter((f) => f.empList.includes(state.emp_id)); // Filter only meetings the employee is included in

    upcomingMeetings.sort((a, b) => new Date(a.mDate) - new Date(b.mDate));

    const lastMeeting = upcomingMeetings.length > 0 ? upcomingMeetings[upcomingMeetings.length - 1] : null;


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                console.log('Fetching tickets for emp_id:', state.emp_id);
                const result = await axios.post('http://localhost:8081/getTicket', { emp_id: state.emp_id });
                setTicketList(result.data);
                console.log(result.data);
            } catch (error) {
                console.error("Error while getting tickets data:", error);

            }
        };
        fetchTickets();
    }, [state])

    const [notifications, setNotifications] = useState([]);


    useEffect(() => {
        if (state.length === 0) return;
        async function fetchNotifications() {
            try {
                const response = await fetch(`http://localhost:8081/notifications`);
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }

        fetchNotifications();
    }, [currentTime]);

    // const [notificationList, setNotificationList] = useState([])
    // useEffect(()=>{
    //     try {
    //         const response = await fetch(`http://localhost:8081/notifications`);
    //     } catch (error) {
            
    //     }
    // })


    return (
        <>
            <div className="landing-dashboard">
                <div className="landing-dashboard-container">

                    <div className="landing-header">
                        <div className='nav'>
                            <img src={logo} alt="" style={{ width: '190px', height: '50px' }} />
                            <p tabindex="0"
                                onClick={() => handleClick(0)}
                                style={{
                                    backgroundColor: selected === 0 ? 'orange' : '',
                                    color: selected === 0 ? 'white' : ''
                                }}
                            >Home</p>

                            {/* <p tabindex="0"
                                onClick={() => handleClick(2)}
                                style={{
                                    backgroundColor: selected === 2 ? 'orange' : '',
                                    color: selected === 2 ? 'white' : ''
                                }}>Projects</p> */}

                            <p tabindex="0"
                                onClick={() => handleClick(1)}
                                style={{
                                    backgroundColor: selected === 1 ? 'orange' : '',
                                    color: selected === 1 ? 'white' : ''
                                }}
                            > Leave</p>


                            <p tabindex="0"
                                onClick={() => handleClick(2)}
                                style={{
                                    backgroundColor: selected === 2 ? 'orange' : '',
                                    color: selected === 2 ? 'white' : ''
                                }}>Ticket</p>

                            <p tabindex="0"
                                onClick={() => handleClick(3)}
                                style={{
                                    backgroundColor: selected === 3 ? 'orange' : '',
                                    color: selected === 3 ? 'white' : ''
                                }}>Holidays</p>

                            <p tabindex="0"
                                onClick={() => handleClick(4)}
                                style={{
                                    backgroundColor: selected === 4 ? 'orange' : '',
                                    color: selected === 4 ? 'white' : ''
                                }}>Policy</p>
                        </div>

                       
                            <div className="nav-2">
                                <img src={logo} alt="" style={{ width: '190px', height: '50px' }} />
                                <div className="menu-icon">
                                    <i className="fa-solid fa-bars"></i>
                                    <div className="nav-2-block">
                                    <p tabindex="0"
                                onClick={() => handleClick(0)}
                                style={{
                                    backgroundColor: selected === 0 ? 'orange' : '',
                                    color: selected === 0 ? 'white' : ''
                                }}
                            >Home</p>

                            {/* <p tabindex="0"
                                onClick={() => handleClick(2)}
                                style={{
                                    backgroundColor: selected === 2 ? 'orange' : '',
                                    color: selected === 2 ? 'white' : ''
                                }}>Projects</p> */}

                            <p tabindex="0"
                                onClick={() => handleClick(1)}
                                style={{
                                    backgroundColor: selected === 1 ? 'orange' : '',
                                    color: selected === 1 ? 'white' : ''
                                }}
                            > Leave</p>


                            <p tabindex="0"
                                onClick={() => handleClick(2)}
                                style={{
                                    backgroundColor: selected === 2 ? 'orange' : '',
                                    color: selected === 2 ? 'white' : ''
                                }}>Ticket</p>

                            <p tabindex="0"
                                onClick={() => handleClick(3)}
                                style={{
                                    backgroundColor: selected === 3 ? 'orange' : '',
                                    color: selected === 3 ? 'white' : ''
                                }}>Holidays</p>

                            <p tabindex="0"
                                onClick={() => handleClick(4)}
                                style={{
                                    backgroundColor: selected === 4 ? 'orange' : '',
                                    color: selected === 4 ? 'white' : ''
                                }}>Policy</p>
                                    </div>
                                </div>
                            </div>
                        


                        <div className='acc-div'>
                            {state.category === 'Employee & Admin' &&
                                <><div className="switch-acc">
                                    <i className="fa-solid fa-angle-down" onClick={e => setSwitchAccClass('visible')}></i>
                                    <div className={switch_acc_class}>
                                        <div className="switch-acc-block ">
                                            <p onClick={switchFun}>Switch Account</p>

                                        </div>
                                    </div>
                                </div></>
                            }
                            <img id='sun' src={sunIcon} alt="" style={{ width: '15px', height: '15px' }} />
                            <p id='date' className='acc-line'>{currentDate.split('-').reverse().join('-')}</p>
                            <p id='time' className='acc-line'>{currentTime}</p>

                            {/* <div style={{ fontSize: '13px' }}>
                                name <br />
                                <span style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.185)' }}>role</span>
                            </div> */}
                            <div><i class="fa-solid fa-bell" onClick={e => {
                                if (account_section_class !== 'hidden') {
                                    setAccountSectionClass('hidden')
                                }
                                setNotificationClass('notification')
                            }}></i></div>
                            <div className={notification_class}>
                                <div className="notification-heading block-heading">
                                    <b style={{ fontSize: '20px', color: 'orange' }}> Notification</b>
                                </div>
                                <div className="notification-content" style={{ fontSize: '12px' }}>
                                    {/* {empLeave.map((item) => (item.status !== 'Pending' ?
                                        <div style={{ display: 'grid', gridTemplateColumns: '170px 40px', gap: '20px', padding: '10px', borderBottom: '1px solid rgba(0, 0, 0, 0.187' }}>
                                            <p>
                                                <b>HR</b> has {item.status} your leave Request

                                            </p>
                                            <p>{item.fromDate.slice(5)}</p>
                                        </div> : ''))} */}

                                        {
                                            notifications?.filter(f=>f.emp_id===state.emp_id).reverse().map(item=>(
                                                <div style={{ display: 'grid', gridTemplateColumns: '170px 40px', gap: '20px', padding: '10px', borderBottom: '1px solid rgba(0, 0, 0, 0.187' }}>
                                                <p>
                                                    {item.msg}
    
                                                </p>
                                                <p>{item.createdAt.split('T')[0].slice(5)}</p>
                                            </div>
                                            ))
                                        }
                                </div>

                            </div>
                            <div className="circle" onClick={e => setAccountSectionClass('account-section')}>
                                <img src={userLogo} alt="" style={{ width: '100%', opacity: '.4' }} />
                            </div>
                            <div className={account_section_class}>
                                <div className='layout-1'></div>
                                <div className='user-circle' style={{ width: '100px', height: '100px', border: '1px solid', borderRadius: '50%', marginTop: '-40px' }}>
                                    <img src={userLogo} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                </div>
                                <p><b>{state.name}</b></p>
                                <p>{state.emp_id}</p>
                                <div className='layout-2' style={{ marginTop: '20px' }}>
                                    <h3>Category</h3>
                                    <h3>:</h3>
                                    <p>{state.category}</p>
                                    <h3>Designation</h3>
                                    <h3>:</h3>
                                    <p>{state.designation}</p>
                                </div>
                                <button onClick={e => navigate('/')} style={{ padding: '5px 10px', borderRadius: '5px' }}>Logout</button>

                            </div>
                        </div>

                    </div>


                    <div className="all-section" onClick={e => { setAccountSectionClass('hidden'); setNotificationClass('hidden'); setSwitchAccClass('hidden') }}>
                        <div className={displayValue[0]}>

                            <div className="landing-section" >
                                <div className="landing-section-1">
                                    <div className="attendance-layout">
                                        <p style={{ width: '100%', display: 'flex', }}> <span style={{ marginLeft: 'auto' }}><i class="fa-solid fa-up-right-and-down-left-from-center" onClick={e => setAttendance_history_class('attendance-history')}></i></span> </p>
                                        <h2>Attendance</h2>
                                        <div className="time-duration" >
                                            <CountdownTimer durationCompleted={duration} path_color='orange' />
                                            {/* <p>Working hours</p> */}
                                        </div>
                                        <div className="punch-time">
                                            <div className="punch-in">
                                                <p style={{ color: 'rgba(255, 255, 255, 0.612)' }}>Punch in</p>
                                                {swipeInTime && <p>{swipeInTime}</p>}

                                            </div>
                                            <div className="punch-out">
                                                <p style={{ color: 'rgba(255, 255, 255, 0.612)' }}>Punch out</p>
                                                {swipeOutTime && <p>{swipeOutTime}</p>}
                                            </div>
                                        </div>

                                        {(swipeInBtn && !swipeInTime) && <button onClick={loginFun}>Punch In</button>}
                                        {(!swipeInBtn || swipeInTime) && <button onClick={logoutFun}>Punch Out</button>}
                                    </div>
                                    <div className="line"></div>

                                </div>
                                <div className="landing-section-2">
                                    <div className="greeting-layout">
                                        <div className="greeting-data">
                                            <div><p style={{ textTransform: 'capitalize' }}>Hi, {state.name}</p>
                                                <h2 >Good {greetingMSG}</h2>
                                                <p style={{ color: '#26262659' }}>Have a good day</p></div>
                                        </div>
                                        <div className="greeting-img">
                                            <img src={workLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>



                                    </div>
                                    <p style={{ padding: '10px 0', fontSize: '18px' }}><b>Quick Status</b></p>
                                    <div className='quick-status'>
                                        <div className='quick-status-container'>
                                            <div className='quick-status-content' >
                                                <p className='headings'><b>Ticket Status</b></p>

                                                {ticketList.length === 0 ? <p className='data'>You have not raise any Tickets.</p> : <p className='data'>Ticket id {ticketList[ticketList.length - 1]?.ticketId} is {ticketList[ticketList.length - 1]?.status === 'Pending' ? 'in progress' : 'Resolved'}. </p>}
                                            </div>
                                            <div className="half-circle">
                                                <img src={circle2} alt="" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                            </div>
                                        </div>
                                        <div className='quick-status-container'>
                                            <div className='quick-status-content'>
                                                <p className='headings'><b>Leave Status</b></p>
                                                {empLeave.length > 0 && (
                                                    <p className='data'>
                                                        Your leave request applied on
                                                        <span style={{ color: 'orange' }}> {empLeave[empLeave.length - 1]?.date || empLeave[empLeave.length - 1]?.fromDate}</span> is <span>{empLeave[empLeave.length - 1].status === 'Pending' ? 'in progress' : empLeave[empLeave.length - 1].status}</span>.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="half-circle">
                                                <img src={circle2} alt="" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                            </div>
                                        </div>
                                        <div className='quick-status-container' id='holiday-quickStatus'>
                                            <div className='quick-status-content' >
                                                <p className='headings'><b>Holiday</b></p>
                                                <p className='data'> <span style={{ color: 'orange' }}>{upcomingHoliday && upcomingHoliday.name}</span> {upcomingHoliday && ` on ${upcomingHoliday.date.split('-').reverse().join('-')}`}</p>
                                                <p ></p>
                                            </div>
                                            <div className="half-circle">
                                                <img src={circle2} alt="" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                            </div>
                                        </div>
                                        <div className='quick-status-container'>
                                            <div className='quick-status-content' >
                                                <p><b>Meeting</b></p>
                                                {lastMeeting ? (
                                                    <div key={lastMeeting.meetingName}>
                                                        <p className='data'>
                                                            The <span style={{ color: 'orange' }}> {lastMeeting.mType}</span> is scheduled for {lastMeeting.mDate} at {lastMeeting.mTime} hrs.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="data">No meetings are scheduled.</p>
                                                )}
                                            </div>
                                            <div className="half-circle">
                                                <img src={circle2} alt="" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div className="landing-section-3">
                                    <div className="calendar-sec">
                                        <div className="calendar-heading">
                                            <p style={{ width: '100%', textAlign: 'center' }}><b>Calendar</b>  </p>
                                            <div>
                                                <span style={{ fontSize: '10px' }}><i class="fa-solid fa-up-right-and-down-left-from-center"></i></span>
                                            </div>
                                        </div>
                                        <Calender id={state.emp_id} />
                                    </div>
                                    <div className="leave-sec">
                                        <div className="calendar-heading">
                                            <p style={{ width: '100%', textAlign: 'center' }}><b>Leave</b>  </p>
                                            <div>
                                                <span style={{ fontSize: '10px' }}><i class="fa-solid fa-up-right-and-down-left-from-center" onClick={() => handleClick(1)}></i></span>
                                            </div>
                                        </div>
                                        <div className="leave-progress">


                                            <LeaveProgressBar leaveData={leaveCollection} type='taken'/>

                                        </div>
                                        <p>
                                            <b>
                                                {`${leaveCollection?.this_month_paidLeave?.length ?? 0} / ${2 + (leaveCollection?.earnedLeave ?? 0)}`
                                                }
                                            </b>
                                        </p>
                                        <button onClick={() => handleClick(5)}>Apply for leave</button>
                                    </div>


                                </div>


                            </div>


                        </div>
                        {/* ------------------------------------------------ */}
                        <div className={displayValue[3]} style={{ width: '100%', padding: '20px', }}>
                            <HolidaysList />
                        </div>


                        <div className={displayValue[1]} style={{ width: '100%', padding: '10px 20px', height: 'inherit' }}>
                            <EmpLeaveSection leaveCollection={leaveCollection} leaveStatus={empLeave} />
                        </div>

                        <div className={displayValue[2]} style={{ width: '100%', padding: '20px', }}>
                            <ApplyTicket state={state} cDate={currentDate} />
                        </div>

                        <div className={displayValue[4]} style={{ width: '100%', height: 'inherit' }}>
                            <Policy />
                        </div>

                        <div className={displayValue[5]} style={{ width: '100%', height: 'inherit' }}>
                            <ApplyLeave state={state} empLeave={leaveCollection} handleClick={handleClick} cDate={currentDate} />

                        </div>

                        {/* ----------------------------------------------------------------------------------------------------- */}

                        <div className={attendance_history_class}>
                            <div className="attendance-history-content">
                                <button onClick={e => setAttendance_history_class('attendance-history hidden')}>Back</button>
                                <h2>Attendance</h2>
                                <div className="table_body">
                                    <table>
                                        <thead>
                                            <tr>


                                                <th>Date</th>
                                                <th>Login Time</th>
                                                <th>Duration</th>
                                                <th>Over Time</th>
                                                <th>Logout Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendance && attendance.reverse().map((item, i) => (
                                                <tr key={i}>
                                                    <td>{item.date.split('-').reverse().join('-')}</td>
                                                    <td>{item.login}</td>
                                                    <td>{item.duration ? `${item.duration} hr` : '-'}</td>
                                                    <td>{item.overTime ? item.overTime : '-'}</td>
                                                    <td>{item.logout ? item.logout : '-'}</td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </div>

                    </div>



                </div>

            </div>
        </>
    )
}

export default LandingDashboard