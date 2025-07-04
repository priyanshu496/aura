import React from 'react'
import { useLocation } from 'react-router-dom'
const Room = () => {

    const location = useLocation();
    console.log(location.state)

  return (
    <div>Room</div>
  )
}

export default Room