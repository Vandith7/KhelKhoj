import React from 'react'
import '../Styles/Register.css'
import logo from '../assets/KhelKhojLogo.png'
import { Link } from 'react-router-dom';
import FileImageUploader from '../Components/FileImageUploader';

function UserRegister() {
    return (
        <div className='container'>
            <div className='header'><img className='logo' src={logo} alt='Khel-Khoj' /><Link style={{ textDecoration: 'none' }} to='/'><p style={{ color: '#F19006', fontFamily: 'Quicksand', fontSize: '28px' }}>Khel-Khoj</p></Link>
                <div className='nav-links'>
                    <ul>
                        <li><Link to="/" className="links">Home</Link></li>
                        <li><Link to="/clubLogin" className="links">Login</Link></li>
                    </ul>
                </div>
            </div>
            <div className='formContainer'>
                <div className='form'>
                    <div><img src={logo} className='formLogo' alt='Khel-Khoj' /> </div>
                    <form className='login'>
                        <h1 className='loginText'>Club Register</h1>
                        <label htmlFor='clubName' className='labels'>Club Name :</label>
                        <input type='text' id='clubName' autoFocus placeholder='Enter club name' required className='inputField'></input>
                        <label htmlFor='email' className='labels'>Email :</label>
                        <input type='email' id='email' placeholder='Enter email address' required className='inputField'></input>
                        <label htmlFor='password' className='labels'>Password :</label>
                        <input type='password' placeholder='Enter password' required className='inputField'></input>
                        <label htmlFor='conPass' className='labels'>Confirm password :</label>
                        <input type='password' id='conPass' placeholder='Confirm Password' required className='inputField'></input>
                        <label htmlFor='location' className='labels'>Location :</label>
                        <textarea id='location' rows={4} maxLength={255} style={{ resize: 'none', width: '53%' }} placeholder="Enter club's location" required className='inputField'></textarea>
                        <label htmlFor='desc' className='labels'>Description :</label>
                        <textarea rows={3} id='desc' maxLength={255} style={{ resize: 'none', width: '53%' }} placeholder='Description of your club' required className='inputField'></textarea>
                        <FileImageUploader name='Club logo' />
                        <button className='loginButton'>Register</button>
                    </form>
                    <div className='orDiv'>
                        <p>or</p>
                        <Link to="/clubLogin" className='regButton'><>Log In to your account</></Link>
                        <div className='notUserContainer'><p>Join as a General User? <Link to="/userRegister" className="notUserLink">Click here</Link></p></div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default UserRegister