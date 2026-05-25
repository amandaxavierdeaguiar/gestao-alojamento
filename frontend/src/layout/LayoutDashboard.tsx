import { useState } from 'react';
import Navbar from '../component/nav/Nav';

import { Outlet } from 'react-router-dom'; // O "yield" do React
import './layout.css';


function LayoutDashboard(){

    const [isRetracted, setIsRetracted] = useState(false);

    return( 
        <div className={`layout-container ${isRetracted ? 'layout-collapsed' : 'layout-expanded'}`}>
        <Navbar isRetracted={isRetracted} setIsRetracted={setIsRetracted} />
        
        <main className="main-content">
            <Outlet />
        </main>

        </div>
    );
}

export default LayoutDashboard;