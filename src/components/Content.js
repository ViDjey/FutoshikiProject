import { useEffect, useState } from 'react'
import Api from '../utils'
import { Input, Modal, Button } from 'antd';

export default function Content({
    sizeGenerateFutoshiki, solveFutoshiki,
    setCountHearts, repeateFutoshiki, countHearts,
    setSizeGenerateFutoshiki, levelComplexity, setLevelComplexity
}) {
 
    const [futoshiki, setFutoshiki] = useState([]);
    const [firstFutoshiki, setFirstFutoshiki] = useState([]);
    const [inequalities, setInequalities] = useState([]);
    const [solutionFutoshiki, setsolutionFutoshiki] = useState([]);
    const [inputErrors, setInputErrors] = useState({});

    const [finishLevel, setFinishLevel] = useState(false);

    useEffect(()=>{
        if (sizeGenerateFutoshiki > 3 && levelComplexity !== -1) {
            const generateFutoshiki = Api.generateFutoshiki(sizeGenerateFutoshiki, levelComplexity);

            setFutoshiki(generateFutoshiki[0]);
            setFirstFutoshiki(generateFutoshiki[0].map(el => Object.assign([],el)));
            setInequalities(generateFutoshiki[1]);
            setsolutionFutoshiki(generateFutoshiki[2]);
        } else {
            setCountHearts(3);
            setInputErrors({});
            setFinishLevel(false);
        }
    }, [sizeGenerateFutoshiki,levelComplexity])

    useEffect(()=>{
        if (solveFutoshiki) {
            setFutoshiki(solutionFutoshiki);
        }
    }, [solveFutoshiki])

    useEffect(()=>{
        if (repeateFutoshiki) {
            setFutoshiki(firstFutoshiki);
            setInputErrors({})
            setCountHearts(3)
        }
    }, [repeateFutoshiki])

    const handleChange = (e) => {
        const { value: inputValue } = e.target;
        const i = e.target.attributes.i.value;
        const j = e.target.attributes.j.value;
        const inputValueInt = parseInt(inputValue, 10);
        if ((inputValueInt !== NaN && inputValueInt > 0 &&  inputValueInt <= sizeGenerateFutoshiki) || inputValue === '') {
            
            const futoshikiInput = futoshiki;
            futoshikiInput[i][j] = inputValueInt || null;
            setFutoshiki(futoshikiInput);

            let valueErrorStatus = inputValue !== '' ? Api.checkErrorInput(futoshiki, inequalities, i, j, inputValueInt) : false;
            if (inputValue !== '' && valueErrorStatus) {
                const count = countHearts - 1;
                setCountHearts(count);
                if (typeof valueErrorStatus === 'string') {
                    const elem = document.getElementById(valueErrorStatus);
                    elem.style.color = 'red';
                    setInputErrors(() => ({
                        ...inputErrors, 
                        [`[${i}][${j}]`]: true,
                    }));
                    setTimeout( () => { elem.style.color = '';
                        setInputErrors(() => ({
                            ...inputErrors, 
                            [`[${i}][${j}]`]: false,
                        }));
                    }, 3000);
                } else {
                    setInputErrors(() => ({
                        ...inputErrors, 
                        [`[${valueErrorStatus[0]}][${valueErrorStatus[1]}]`]: true,
                        [`[${i}][${j}]`]: valueErrorStatus,
                    }));
                    setTimeout(() => { setInputErrors({
                        ...inputErrors, 
                        [`[${valueErrorStatus[0]}][${valueErrorStatus[1]}]`]: false,
                    })}, 3000);
                }
            } else {
                setInputErrors(() => ({
                    ...inputErrors, 
                    [`[${i}][${j}]`]: valueErrorStatus,
                }));
            }
            completedLevel();
        }
    };

    const completedLevel = () => {
        let isFinished = true;
        if (JSON.stringify(futoshiki).indexOf('null') !== -1) {
            setFinishLevel(false);
            return;
        }
        if (JSON.stringify(futoshiki) === JSON.stringify(solutionFutoshiki) && !solveFutoshiki
        ) {
            setFinishLevel(true);
            return;
        }
        for (var statusError in inputErrors) {
            if (statusError === true) {
                isFinished = false;
                continue;
            }
        }
        setFinishLevel(true)

    }

    const findInequalities = (i1, j1, i2, j2) => {
        const found = inequalities.find((el) => (i1 === el[0].x && j1 === el[0].y && i2 === el[1].x && j2 === el[1].y 
            || i2 === el[0].x  && j2 === el[0].y && i1 === el[1].x && j1 === el[1].y
        ))
        let str = '';
        if (found) {
            if (i1 === found[0].x && j1 === found[0].y && i2 === found[1].x && j2 === found[1].y ) {
                if (j1 === j2) str = '∨';
                else str = '>';
            } else {
                if (j1 === j2) str = '∧';
                else str = '<';
            }
        }
        return str;
    }

    const getFutoshikiContent = () => {
        let content = [];
        for (let i = 0; i < futoshiki.length; i++) {
            for (let j = 0; j < futoshiki.length; j++) {
                content.push(
                    <Input
                        value={futoshiki[i][j]}
                        className='futoshiki_item'
                        key={`[${i}][${j}]`}
                        disabled={firstFutoshiki[i][j]}
                        status={inputErrors[`[${i}][${j}]`] ? 'error' : ''}
                        style={{color: inputErrors[`[${i}][${j}]`] ? 'red' : ''}}
                        i={i} j={j}
                        onChange={handleChange}
                        maxLength={1}
                    />
                )
                if (j != futoshiki.length - 1) {
                    content.push(<div key={`[${i}][${j}][${i}][${j+1}]`} id={`[${i}][${j}][${i}][${j+1}]`}  
                        className='futoshiki_inequalities'>{findInequalities(i, j, i, j+1)}</div>)
                }
            }
            if (i != futoshiki.length - 1) {
                for (let j = 0; j < futoshiki.length + futoshiki.length - 1; j++) {
                    let str = '';
                    let id = '';
                    if (j % 2 === 0) {
                        str = findInequalities(i, j / 2 , i + 1, j / 2);
                        id = `[${i}][${j / 2}][${i+1}][${j / 2}]`
                    }
                    content.push(<div key={`[${i}][${j}][${i+1}][${j}]`} id={id}  className='futoshiki_inequalities'>{str}</div>)
                }
            }
        }
        return content;
    };

    const generate = () => {
        const time = [];
        const n = 11;
        for (let i = 0; i < 30; i++) {
            const generateFutoshiki = Api.generateFutoshiki(n, 2);
            time.push([generateFutoshiki[0], n, generateFutoshiki[1]]);
            console.log('push')
        }
        console.log(JSON.stringify(time));
    }
 
  return <div className='futoshiki_grid'>   
   <Button key="Update"  onClick={()=>{generate()}}> Update</Button>
   <Button key="solver"  onClick={()=>{Api.comparison()}}> solver</Button>
    { sizeGenerateFutoshiki > 3 && levelComplexity !== -1 ?
            <div className='futoshiki' style={{
                gridTemplateColumns: `repeat(${futoshiki.length + futoshiki.length - 1}, 60px)`,
                gridTemplateRows: `repeat(${futoshiki.length + futoshiki.length - 1}, 60px)`}}>

                {getFutoshikiContent()}</div> : null
    }
    {
        finishLevel ?
        (
            <Modal
            open={finishLevel}
            title="Уровень пройден!"
            footer={[ <Button key="ok"  onClick={()=>{
                setFinishLevel(false); setSizeGenerateFutoshiki(0); setLevelComplexity(-1)
            }}> Ок</Button>]}
            ></Modal>) : null
    }
  </div>;
}

