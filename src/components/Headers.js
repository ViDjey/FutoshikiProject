export default function Headers(props) {
    return (
        <header className="header">
            {props.hasButtonBack ? 
                <a className = 'button_small' href = "/">&#8617;</a> : null
            }
            {props.hasMistake ? 
               <p id = "mistake">! Player command failed: Premium required !</p> : null
            }
        </header>
    )

}