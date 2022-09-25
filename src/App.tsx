import React from 'react';
import { useState } from 'react'
import Headers from "./components/Headers";
import Accordion from "./components/Accordion";
import Content from "./components/Content";
import Footer from "./components/Footer";
import './styles.css';

function App() {
    const[mistake, sethasMistake] = useState(false)
    const[back, sethasButtonBack] = useState(false)
    const[infoTrack, setUpdateInfo] = useState(null)
    return (
        <div className = 'start'> 
            <Headers hasMistake = {mistake} hasButtonBack = {back} />
            <Accordion />
            <Content updateMistake = {sethasMistake} updateBack = {sethasButtonBack} updateInfo = {setUpdateInfo} />
            <Footer infoTrack = {infoTrack}/>
        </div>
    )
 }

 export default App;
