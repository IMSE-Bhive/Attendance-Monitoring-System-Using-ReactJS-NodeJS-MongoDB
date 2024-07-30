import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'; 

function Calender({ id }) {
  const [value, setValue] = useState(new Date());
  const [leaveData, setLeaveData] = useState({ present_days: [], lop: [], paid_leave: [] });

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/getLeave/${id}`);
        const data = await response.json();

        const formatDateString = (dateString) => {
          const [day, month, year] = dateString.split('-');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        const formatDateString2 = (dateString) => {
          const [year,month,day] = dateString.split('-');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        
        const formattedData = {
          present_days: data.present_days ? data.present_days.map(formatDateString2) : [],
          lop: data.lop ? data.lop.map(formatDateString2) : [],
          paid_leave: data.paid_leave ? data.paid_leave.map(formatDateString2) : [],
        };

        console.log(data.present_days);
        console.log(data.absent_days)
        setLeaveData(formattedData);
        console.log("-----------Calendar working-------------", id + '----');
        console.log(formattedData.present_days);
        console.log(formattedData.lop);
        console.log(formattedData.paid_leave);
        console.log("-----------Calendar working-------------");
      } catch (err) {
        console.error('Error fetching leave data:', err);
      }
    };

    if (id) {
      fetchLeaveData();
    }
  }, [id]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isNationalHoliday = (date) => {
    const nationalHolidays = [
      '2024-01-01',
      '2024-01-26',
      '2024-03-25',
      '2024-06-17',
      '2024-08-15',
      '2024-10-02',
      '2024-10-12',
      '2024-11-01',
      '2024-12-25',
    ];
    return nationalHolidays.includes(formatDate(date));
  };

  const isAbsentDay = (date) => {
    return leaveData?.lop?.includes(formatDate(date));
  };

  const isPresentDay = (date) => {
    return leaveData?.present_days?.includes(formatDate(date));
  };

  const isPaidLeaveDay = (date) => {
    return leaveData?.paid_leave?.includes(formatDate(date));
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (date.getDay() === 6 || date.getDay() === 0) {
        return 'weekend';
      }
      if (isNationalHoliday(date)) {
        return 'holiday';
      }
      if (isAbsentDay(date)) {
        return 'absent';
      }
      if (isPresentDay(date)) {
        return 'present';
      }
      if (isPaidLeaveDay(date)) {
        return 'paid-leave';
      }
    }
    return null;
  };

  

  return (
    <div>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
        className="custom-calendar"
      />
    </div>
  );
}

export default Calender;


// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './calendar.css';

// function Calender({ id }) {
//   const [value, setValue] = useState(new Date());
//   const [leaveData, setLeaveData] = useState({ present_days: [], lop: [], paid_leave: [] });

//   useEffect(() => {
//     const fetchLeaveData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8081/getLeave/${id}`);
//         const data = await response.json();

//         const formatDateString = (dateString) => {
//           const [day, month, year] = dateString.split('-');
//           return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//         };

//         const formattedData = {
//           present_days: data.present_days ? data.present_days.map(formatDateString) : [],
//           lop: data.lop ? data.lop.map(formatDateString) : [],
//           paid_leave: data.paid_leave ? data.paid_leave.map(formatDateString) : [],
//         };

//         setLeaveData(formattedData);
//       } catch (err) {
//         console.error('Error fetching leave data:', err);
//       }
//     };

//     if (id) {
//       fetchLeaveData();
//     }
//   }, [id]);

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const isNationalHoliday = (date) => {
//     const nationalHolidays = [
//       '2024-01-01',
//       '2024-01-26',
//       '2024-03-25',
//       '2024-06-17',
//       '2024-08-15',
//       '2024-10-02',
//       '2024-10-12',
//       '2024-11-01',
//       '2024-12-25',
//     ];
//     return nationalHolidays.includes(formatDate(date));
//   };

//   const isAbsentDay = (date) => {
//     return leaveData?.lop?.includes(formatDate(date));
//   };

//   const isPresentDay = (date) => {
//     return leaveData?.present_days?.includes(formatDate(date));
//   };

//   const isPaidLeaveDay = (date) => {
//     return leaveData?.paid_leave?.includes(formatDate(date));
//   };
//   const tileClassName = ({ date, view }) => {
//     if (view === 'month') {
//       if (date.getDay() === 6 || date.getDay() === 0) {
//         return 'weekend';
//       }
//       if (isNationalHoliday(date)) {
//         return 'holiday';
//       }
//       if (isAbsentDay(date)) {
//         return 'absent';
//       }
//       if (isPresentDay(date)) {
//         return 'present';
//       }
//       if (isPaidLeaveDay(date)) {
//         return 'paid-leave';
//       }
//     }
//     return null;
//   };

//   const getTileContent = ({ date, view }) => {
//     if (view === 'month') {
//       let tooltipText = '';
//       if (isNationalHoliday(date)) {
//         tooltipText = 'National Holiday';
//       } else if (isAbsentDay(date)) {
//         tooltipText = 'Absent Day';
//       } else if (isPresentDay(date)) {
//         tooltipText = 'Present Day';
//       } else if (isPaidLeaveDay(date)) {
//         tooltipText = 'Paid Leave';
//       }
//       return tooltipText ? <div className="tooltip">{tooltipText}</div> : null;
//     }
//     return null;
//   };

//   return (
//     <div>
//       <Calendar
//         onChange={setValue}
//         value={value}
//         tileClassName={tileClassName}
//         tileContent={getTileContent}
//         className="custom-calendar"
//       />
//     </div>
//   );
// }

// export default Calender;

// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './calendar.css'; 

// function Calender({ id }) {
//   const [value, setValue] = useState(new Date());
//   const [leaveData, setLeaveData] = useState({ present_days: [], lop: [], paid_leave: [] });

//   useEffect(() => {
//     const fetchLeaveData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8081/getLeave/${id}`);
//         const data = await response.json();

//         const formatDateString2 = (dateString) => {
//           const [year, month, day] = dateString.split('-');
//           return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//         };

//         const formattedData = {
//           present_days: data.present_days ? data.present_days.map(formatDateString2) : [],
//           lop: data.lop ? data.lop.map(formatDateString2) : [],
//           paid_leave: data.paid_leave ? data.paid_leave.map(formatDateString2) : [],
//         };

//         setLeaveData(formattedData);
//       } catch (err) {
//         console.error('Error fetching leave data:', err);
//       }
//     };

//     if (id) {
//       fetchLeaveData();
//     }
//   }, [id]);

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const isNationalHoliday = (date) => {
//     const nationalHolidays = [
//       '2024-01-01',
//       '2024-01-26',
//       '2024-03-25',
//       '2024-06-17',
//       '2024-08-15',
//       '2024-10-02',
//       '2024-10-12',
//       '2024-11-01',
//       '2024-12-25',
//     ];
//     return nationalHolidays.includes(formatDate(date));
//   };

//   const isAbsentDay = (date) => {
//     return leaveData?.lop?.includes(formatDate(date));
//   };

//   const isPresentDay = (date) => {
//     return leaveData?.present_days?.includes(formatDate(date));
//   };

//   const isPaidLeaveDay = (date) => {
//     return leaveData?.paid_leave?.includes(formatDate(date));
//   };

//   const getTileContent = ({ date, view }) => {
//     if (view === 'month') {
//       if (isNationalHoliday(date)) {
//         return <span className="tooltip" title="National Holiday" > NH</span>;
//       }
//       if (isAbsentDay(date)) {
//         return <span className="tooltip" title="Absent Day">AD</span>;
//       }
//       if (isPresentDay(date)) {
//         return <span className="tooltip" title="Present Day">PD</span>;
//       }
//       if (isPaidLeaveDay(date)) {
//         return <span className="tooltip" title="Paid Leave">PL</span>;
//       }
//     }
//     return null;
//   };

//   return (
//     <div>
//       <Calendar
//         onChange={setValue}
//         value={value}
//         tileContent={getTileContent}
//         className="custom-calendar"
//       />
//     </div>
//   );
// }

// export default Calender;
