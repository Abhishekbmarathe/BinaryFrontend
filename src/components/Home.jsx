import React from 'react'
import Nav from './bottomNavbar'
import TopNav from './TopNav'
import Sidepannel from './Sidepannel'
import Alluser from './Alluser'

function Home() {
    return (
        <div>
            <TopNav />
            <Nav />
            <Sidepannel />
        </div>
    )
}

export default Home
