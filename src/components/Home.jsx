import React from 'react'
import Nav from './bottomNavbar'
import TopNav from './TopNav'
import Sidepannel from './Sidepannel'
import Userdetails from './Manage_Users/Userdetails'

function Home() {
    return (
        <div>
            <TopNav />
            <Nav />
            <Sidepannel />
            <Userdetails />
        </div>
    )
}

export default Home
