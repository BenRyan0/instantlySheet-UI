import React from 'react'
import { LoginForm } from './../components/login-form';

const Login = () => {
  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center text-white">
        <LoginForm className="lg:w-3/12 w-9/12"/>
    </div>
  )
}

export default Login