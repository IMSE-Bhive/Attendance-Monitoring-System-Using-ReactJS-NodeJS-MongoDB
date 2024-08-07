import React, { useContext, useEffect, useState } from 'react'
import logo from '../Assets/immensphereLogo.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { AppContext } from '../context/AppContext';

function Home() {
    const [captcha1, setCaptcha1] = useState(null);

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const fetchCaptcha = async () => {
        try {
            const response = await fetch('http://localhost:3000/captcha');
            const data = await response.json();
            setCaptcha1(data);
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
    };


    const randomString = Math.random().toString(36).slice(7);
    const [generatedCaptcha, setGeneratedCaptcha] = useState(randomString)
    const navigate = useNavigate()

    const changeCaptcha = () => {
        setGeneratedCaptcha(Math.random().toString(36).slice(7))
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [captcha, setCaptcha] = useState('')
    const [error, setError] = useState('')

    const { setUser, user } = useContext(AppContext) //set the value for context

    const login = (e) => {
        e.preventDefault()
        let id;
        axios.post('http://localhost:8081/employeeValidate', { emp_id: email, password: password })
            .then((result) => {
                //   const users=result.data
                //   console.log(users)
                let flag = result.data ? true : false
                //   let userDetails = null;//it store the users data for setting value for  context 
                //   users.map(item=>{
                //     let getEmail=item.emp_id
                //     let getPassword=item.password
                //     console.log(getEmail+" "+getPassword)
                //     if(email===getEmail && password===getPassword){
                //       flag=true
                //       id=item._id
                //       userDetails=item // set the matched object {...} for the variable
                //     } 
                //   })
                // if(result.data){
                //     flag=true
                // }else

                if (!flag) {
                    setError("Invalid Email or Password")
                }
                else if (captcha !== generatedCaptcha) {
                    setError('Invalid Captcha')
                }
                else {
                    alert('Login Successfully')
                    setUser(result.data) //updating the values for context
                    // navigate(`/empDashboard`,{ state:result.data })
                    navigate(`/landingPage`,{ state:result.data })
                }


            })
            .catch(err => console.log(err))


    }
    useEffect(() => {
        console.log('----------');
        console.log(user);
    }, [user]); // Log user context whenever it changes
    return (
        <>
            <div className="home">
            <div className="logo">
                            <img src={logo} alt="Not Found" />
                        </div>

                <div className="home-header">
                    <div className="part1">
                        <h2 >Employee Login</h2>
                        
                        <div className="container">
                            <form action="">

                                <input type="text" placeholder="Email or Phone" value={email} onChange={e => setEmail(e.target.value)} onClick={e => { setError('') }}></input>

                                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onClick={e => { setError('') }} />
                                <div className="captcha">
                                
                                    <label  >{generatedCaptcha} <span onClick={changeCaptcha}><img src="https://cdn-icons-png.flaticon.com/128/2805/2805355.png" alt="" style={{width:'20px',height:'20px',verticalAlign:'middle'}}/></span></label>
                                    
                                </div>
                                <input type="text" placeholder='Enter the Captcha' onChange={e => setCaptcha(e.target.value)} onClick={e => { setError('') }} />
                                {error && <p style={{ color: 'red', textAlign: 'center', position: 'relative' }}> <br />{error} </p>}
                                <button onClick={login}>Log In</button>

                            </form>
                        </div>
                    </div>


                    {/* <div className="part2">
                        <div className="logo">
                            <img src={logo} alt="Not Found" />
                        </div>


                        <div className="help-container">
                            <h3>Let Us Help You</h3>
                            <br />
                            <form action="">

                                <textarea name="" id="" placeholder='Ask Your Queries'>

                                </textarea>
                                <br /><br />

                                <button>Submit</button>
                            </form>
                        </div>
                    </div> */}
                </div>

            </div>

        </>
    )
}

export default Home

