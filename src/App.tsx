import Content from "./components/Content";
import { useState } from 'react'
import Headers from "./components/Headers";

import './styles.css';

function App() {
    const[sizeGenerateFutoshiki, setSizeGenerateFutoshiki] = useState(0);
    const[levelComplexity, setLevelComplexity] = useState(-1);
    const[solveFutoshiki, setSolveFutoshiki] = useState(false);
    const[repeateFutoshiki, setRepeateFutoshiki] = useState(false);
    const [countHearts, setCountHearts] = useState([3]);
    return (
        <div className = 'start'> 

            <div className='futoshiki_grid futoshiki_title'> Футошики</div>
            <Headers 
                setSizeGenerateFutoshiki = {setSizeGenerateFutoshiki}
                sizeGenerateFutoshiki = { sizeGenerateFutoshiki }
                setSolveFutoshiki = { setSolveFutoshiki }
                setRepeateFutoshiki = { setRepeateFutoshiki }
                countHearts = { countHearts }
                levelComplexity = { levelComplexity }
                setLevelComplexity = { setLevelComplexity }
            />
            <Content 
                sizeGenerateFutoshiki = {sizeGenerateFutoshiki}
                solveFutoshiki = { solveFutoshiki }
                setCountHearts = { setCountHearts }
                repeateFutoshiki = { repeateFutoshiki }
                countHearts = { countHearts }
                setSizeGenerateFutoshiki = {setSizeGenerateFutoshiki}
                levelComplexity = { levelComplexity }
                setLevelComplexity = { setLevelComplexity }
            />
        </div>
    )
 }

 export default App;
