import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import Icon from '../../assets/skillTreeIcon.png';

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
        return (
        <nav className='flex items-center justify-between w-full z-20 fixed top-0 left-0 h-12 px-4 border-b bg-gray-200'>
            {/* Logo and App Name Link */}
            <Link to={userLoggedIn ? '/' : '/login'} className='flex items-center'>
                <img 
                    src={Icon} 
                    alt="SkillTree logo" 
                    className='h-8 w-8 mr-2'
                />
                <span className='font-bold text-gray-800'>SkillTree.top</span>
            </Link>

            {/* Auth links on right side */}
            <div>
                {userLoggedIn ? (
                    <button 
                        onClick={() => doSignOut().then(() => navigate('/login'))} 
                        className='flex items-center text-sm text-blue-600 underline'
                    >
                        <span>logout</span>
                    </button>
                ) : (
                    <div className='flex gap-x-4'>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>
                            Login
                        </Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Header