import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {

    const { user, setUser } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                navigate('/signin')
                setLoading(false)
                return
            }

            if (!user) {
                try {
                   
                    const response = await axios.get('/user/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setUser(response.data.user)
                } catch (error) {
                    console.error('Token validation failed:', error)
                    localStorage.removeItem('token')
                    navigate('/signin')
                }
            }
            setLoading(false)
        }

        checkAuth()
    }, [token, user, navigate, setUser])

    if (loading) {
        return (

         <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-black flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-zinc-600 border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">Loading...</h2>
            <p className="text-zinc-400 text-sm">Please wait while we set things up</p>
          </div>

          {/* Animated Dots */}
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserAuth