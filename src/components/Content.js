import { useEffect, useState } from 'react'
import Api from '../utils'
import CreateGenres from "./CreateGenres";
import CreatePlaylist from "./CreatePlaylist"

export default function Content(props) {
    const[genres, setGenres] = useState([])
    const[playlistId, setPlaylistId] = useState(null)
    useEffect(()=>{
            Api.getGenres().then((gnrs=>setGenres(gnrs)))
    }, []) 
    useEffect(()=>{
        if (playlistId != null) props.updateBack(true)
    }, [playlistId])
    
    /**генерация цвета для контейнеров жанров*/
    function getRandomColor() {
        var letters = "0123456789ABCDEF"
        var randomColor = "#"
        for (var i = 0; i < 6; i++) {
        randomColor += letters[Math.floor(Math.random() * letters.length)]
        }
        return randomColor
    }
    if (playlistId == null){
        return (
            <main className="content">
                <h2 className="text-indent">Жанры</h2>
                <div id="list-group"> 
                {
                    genres.map((genre) => (
                        <button className="genres" 
                            key={genre.id}  
                            style={{backgroundColor: getRandomColor()}}
                        >
                        <p>{genre.name}</p> 
                        <CreateGenres genreId = {genre.id} updateData = {setPlaylistId} />
                        </button> 
                        
                    ))
                }
                </div>  
            </main>
        )
    }
    else {
        return (
            <main className="content">
                <CreatePlaylist playlistId = {playlistId} updateMistake = {props.updateMistake} updateInfo = {props.updateInfo}/>
            </main>
        )
    }
}

