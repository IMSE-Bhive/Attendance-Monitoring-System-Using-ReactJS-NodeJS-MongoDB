const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { createCanvas } = require('canvas');

const app = express()
app.use(cors())
app.use(express.json())

// const generateCaptcha = () => {
//   const canvas = createCanvas(200, 50);
//   const ctx = canvas.getContext('2d');

//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let captchaText = '';
//   for (let i = 0; i < 6; i++) {
//     captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
//   }

//   ctx.fillStyle = '#f0f0f0';
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   ctx.font = '30px Arial';
//   ctx.fillStyle = '#000';
//   ctx.fillText(captchaText, 50, 35);

//   return {
//     image: canvas.toDataURL(),
//     text: captchaText,
//   };
// };

// app.get('/captcha', (req, res) => {
//   const captcha = generateCaptcha();
//   res.json(captcha);
// });

mongoose.connect("mongodb://localhost:27017/attendanceManagement")

const UserSchema = new mongoose.Schema({
    emp_id:String,
    name:String,
    password:String,
    category:String,
    last_login_date_time: { type: String, default: '' },
    designation:String
})

const UserSchema2 = new mongoose.Schema({
    emp_id:String,
    paid_leave: {type:Array,default:[]},
    unpaid_leave: {type:Array,default:[]},
    lop: {type:Array,default:[]},
    total_paidLeave: {type:Number,default:24},
    total_unpaidLeave: {type:Number,default:5},
    other_leave:Number,
    total_leave:Number,
    balance_leave:{type:Number,default:24},
    total_working_days: {type:Array,default:[]},
    present_days: {type:Array,default:[]},
    this_month_paidLeave : {type:Array,default:[]},
    this_month_unpaidLeave : {type:Array,default:[]},
    earnedLeave : {type:Number,default:0},
    currentMonth:{type:Number,default:0},
})


const UserModel = mongoose.model("employees", UserSchema)
const UserModelLeave = mongoose.model("leave_collection", UserSchema2)


const UserSchema6 = new mongoose.Schema({
    emp_id:String,
    week:{type:String,default:'0:0'},
    month:{type:String,default:'0:0'},
    overTime:{type:String,default:'0:0'}
},{collection:'progress'})
const UserModelProgress = mongoose.model("progress", UserSchema6)


app.post('/createUser', async(req,res)=>{
    try {
       const userResult = await UserModel.create(req.body);
       const progressResult = await UserModelProgress.create({emp_id:req.body.emp_id});
       res.json([userResult, progressResult]);
        
    } catch (error) {
        res.json({error:err.message})
    }

})

app.post('/employeeValidate',(req,res)=>{
    UserModel.findOne({emp_id:req.body.emp_id, password:req.body.password})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.post('/getEmployee',(req,res)=>{
    UserModel.findOne({emp_id:req.body.emp_id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.get('/getUser',(req,res)=>{
    UserModel.find({})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.get('/getUser/:id',(req,res)=>{
    const id=req.params.id
    UserModel.findById({_id:id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.put('/updateUser/:id',(req,res)=>{
    const id=req.params.id
    UserModel.findByIdAndUpdate({_id:id},{name:req.body.name, emp_id:req.body.email,password:req.body.password,category:req.body.category,designation:req.body.designation})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.put('/logout',(req,res)=>{   
    UserModel.findOneAndUpdate({emp_id:req.body.emp_id},{ last_login_date_time:req.body.logoutTime})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})


app.post('/createLeave',(req,res)=>{
    UserModelLeave.create(req.body)
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.post('/getLeave',(req,res)=>{
    UserModelLeave.findOne({emp_id:req.body.emp_id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.get('/getLeave',(req,res)=>{
    UserModelLeave.find({})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.get('/getLeave/:id',(req,res)=>{
    UserModelLeave.findOne({emp_id:req.params.id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.put('/updateDays', (req, res) => {
    const { emp_id, date, action } = req.body;
    
    if (!emp_id || !date || !action) {
      return res.json({ error: "Invalid request parameters" });
    }
    if (action === 'Rejected') {
        return res.json({ msg: "Rejected" });
    }
    const updateQuery = {
      $push: { total_working_days: date }
    };
  
    if (action === 'swipeIn') {
      updateQuery.$push.present_days = date;
    } else if (action === 'Approved') {
      updateQuery.$push.paid_leave = date;
      updateQuery.$inc = { total_leave: 1, balance_leave: -1 };
    } else if ( action==='absent') {
      updateQuery.$push.lop = date;
    }  
    else {
      return res.json({ error: "Invalid action" });
    }
  
    UserModelLeave.updateOne({ emp_id }, updateQuery)
      .then(result => res.json(result))
      .catch(err => res.json(err));
  });

//   emp_id:String,
//     week:{type:String,default:''},
//     month:{type:String,default:''},
//     overTime:{type:String,default:''}


app.post('/getProgress',(req,res)=>{
    UserModelProgress.findOne({emp_id : req.body.emp_id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
  app.put('/updateProgress',(req,res)=>{
    UserModelProgress.findOneAndUpdate({emp_id:req.body.emp_id},{week:req.body.week, month:req.body.month, overTime:req.body.overTime})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

const UserSchema3 = new mongoose.Schema({
    emp_id:String,
    date:String,
    login:String,
    logout:{type:String,default:''},
    duration:{type:String,default:''},
    overTime:{type:String,default:''}
})
const UserModelAttendance = mongoose.model("attendances", UserSchema3)

app.post('/createAttendance',(req,res)=>{
    UserModelAttendance.findOne({emp_id:req.body.emp_id, date:req.body.date})
    .then(result=>{
        if(!result){
            UserModelAttendance.create(req.body)
            .then(result2=>res.json(result2))
            .catch(err=>res.json(err))
        }
        else{
            res.json({message:`${result.emp_id} Alredey login`})
        }
        
    })
    .catch(err=>res.json(err))
})
app.put('/updateLogout',(req,res)=>{
    UserModelAttendance.findOneAndUpdate({emp_id:req.body.emp_id,date:req.body.date},{logout:req.body.logout, duration:req.body.duration})
    .then(result=>{
        res.json(result)
    })
    .catch(err=>rex.json(err))
})
app.post('/getAttendance',(req,res)=>{
    UserModelAttendance.find({emp_id:req.body.emp_id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.get('/getAllEmpAttendance',(req,res)=>{
    UserModelAttendance.find({})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

const UserSchema4 = new mongoose.Schema({
    emp_id:String,
    date:{type:String,default:''},
    fromDate:String,
    toDate:String,
    dayType:String,
    leaveType:String,
    remarks:String,
    status:String
})
const UserModelPendingLeave = mongoose.model("pending_leaves", UserSchema4)
app.post('/applyLeave',(req,res)=>{
    UserModelPendingLeave.create(req.body)
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.post('/getLeaveStatus',(req,res)=>{
    UserModelPendingLeave.find({emp_id:req.body.emp_id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.get('/getApplyLeave',(req,res)=>{
    UserModelPendingLeave.find({status:'Pending'})
    .then(result=>res.json(result))
    .catch(err=>re.sjson(err))
})
app.get('/getApprovedLeave',(req,res)=>{
    UserModelPendingLeave.find({status:{$in:['Approved','Rejected']}})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.put('/leaveStatus',(req,res)=>{
    UserModelPendingLeave.findOneAndUpdate({emp_id:req.body.emp_id, fromDate:req.body.fromDate, toDate:req.body.toDate},{status:req.body.status})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})

const UserSchema5 = new mongoose.Schema({
    emp_id:String,
    query:String
},{collection:'help'})
const UserModelHelp = mongoose.model("help", UserSchema5)
app.post('/sendHelp',(req,res)=>{
    UserModelHelp.create(req.body)
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
// ---------------------------------------------------


const UserSchema_Ticket_number = new mongoose.Schema({
    num:{type:Number,default:1}
})
const UserModelTicket_number= mongoose.model("ticket_number", UserSchema_Ticket_number)

app.get('/ticketNo', async (req, res) => {
  try {
    // Fetch the current number
    const ticket = await UserModelTicket_number.findOne();

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket number not found' });
    }

    // Increment the number
    const newNumber = ticket.num + 1;

    // Update the number in the database
    ticket.num = newNumber;
    const updatedTicket = await ticket.save();

    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ------------------------------------------------------


const UserSchema_Ticket = new mongoose.Schema({
    emp_id:String,
    name:String,
    team:String,
    priority:String,
    ticketId:String,
    description:String,
    date:String,
    status:{type:String,default:'Pending'}
})
const UserModelTicket= mongoose.model("tickets", UserSchema_Ticket)
app.post('/applyTicket',(req,res)=>{
    UserModelTicket.create(req.body)
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.post('/getTicket',(req,res)=>{
    UserModelTicket.find({emp_id:req.body.emp_id})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
})
app.get('/getAllTickets',async(req,res)=>{
    try {
        const result = await UserModelTicket.find({})
        res.json(result)
    } catch (error) {
        res.status(500).json(err)
    }
})
app.put('/updateTickets',async(req,res)=>{
    try {
        const result = await UserModelTicket.findOneAndUpdate({ticketId:req.body.ticketId},{status:req.body.status})
        res.json(result)
    } catch (error) {
        res.status(500).json(err)
    }
})




app.listen(8081, ()=>console.log('Server is running on port 8081'))