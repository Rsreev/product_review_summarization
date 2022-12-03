import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import './SideNav.css';
import { SideNavData } from './SideNavData';
function SideNav() {
    return (
        
        <div className="SideNav">
            
            <ul className="SideNavList">
            { SideNavData.map((val, key) => {
            return (
                
                <li className="SideNavRows"
                key = {key}
                id = {window.location.pathname == val.link ? "active" : ""}
                
                onClick={() =>{
                    window.location.pathname=val.link
                }}
                > 
                
                
                <div id="navIcons">{val.icon}</div>  
                <div id="navTitles">{val.title}</div>
                
                </li>
                
                
            );
            })}
            </ul>
        </div>
    );
}

export default SideNav