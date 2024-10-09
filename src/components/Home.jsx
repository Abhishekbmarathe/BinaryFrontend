import React, { useEffect } from 'react'
import Nav from './bottomNavbar'
import TopNav from './TopNav'
import Sidepannel from './Sidepannel'
import Userdetails from './Manage_Users/Userdetails'
import getAllcustomers from './modules/getAllcustomers'

function Home() {

    useEffect(() => {
        getAllcustomers();
    })
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
