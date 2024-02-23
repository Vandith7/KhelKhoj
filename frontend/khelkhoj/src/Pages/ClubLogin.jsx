import React from 'react'
import '../Styles/Login.css'
import logo from '../assets/KhelKhojLogo.png'
import { Link } from 'react-router-dom';

function ClubLogin() {
    return (
        <div className='container'>
            <div className='header'><img className='logo' src={logo} alt='Khel-Khoj' /><Link style={{ textDecoration: 'none' }} to='/'><p style={{ color: '#F19006', fontFamily: 'Quicksand', fontSize: '28px' }}>Khel-Khoj</p></Link>
                <div className='nav-links'>
                    <ul>
                        <li><Link to="/" className="links">Home</Link></li>
                        <li><Link to="/clubRegister" className="links">Register</Link></li>
                    </ul>
                </div>
            </div>
            <div className='formContainer'>
                <div className='form'>
                    <div><img src={logo} className='formLogo' alt='Khel-Khoj' /> </div>
                    <form className='login'>
                        <h1 className='loginText'>Club Login</h1>
                        <label htmlFor='email' className='labels'>Email :</label>
                        <input type='email' id='email' autoFocus placeholder='Enter email address' required className='inputField'></input>
                        <label htmlFor='password' className='labels'>Password :</label>
                        <input type='password' id='password' placeholder='Enter password' required className='inputField'></input>
                        <button className='loginButton'>Log In</button>
                    </form>
                    <div className='orDiv'>
                        <p>or</p>
                        <Link to="/clubRegister" className='regButton'><>Create an account</></Link>
                        <div className='notUserContainer'><p>A General User? <Link to="/userLogin" className="notUserLink">Click here</Link></p></div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ClubLogin