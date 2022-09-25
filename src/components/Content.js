import { useEffect, useState } from 'react'
import useLoginStatus from './useLoginStatus'
import Api from '../utils'
import CreateGenres from "./CreateGenres";
import CreatePlaylist from "./CreatePlaylist"

export default function Content({ updateMistake, updateBack, updateInfo }) {
 
    const[playlistId, setPlaylistId] = useState(null)
    const { data, isLoading, error } = useLoginStatus("genres",  Api.getGenres)

    useEffect(()=>{
        if (playlistId != null) updateBack(true)
    }, [updateBack, playlistId])
    
    /**генерация цвета для контейнеров жанров*/
    function getRandomColor() {
        var letters = "0123456789ABCDEF"
        var randomColor = "#"
        for (var i = 0; i < 6; i++) {
        randomColor += letters[Math.floor(Math.random() * letters.length)]
        }
        return randomColor
    }

    if (error) return <main className="content">Ошибка! Найти жанры не удалось</main>
    if (isLoading) return <main className="content">Loading....</main>
    if (playlistId == null){
        return (
            <main className="content">
                <h2 className="text-indent">Жанры</h2>
                <div id="list-group"> 
                { data ? 
                    data.map((genre) => (
                        <button className="genres" 
                            key={genre.id}  
                            style={{backgroundColor: getRandomColor()}}
                        >
                        <p>{genre.name}</p> 
                        <CreateGenres genreId = {genre.id} updateData = {setPlaylistId} />
                        </button> 
                        
                    ))
                    : <>Ошибка! Найти жанры не удалось</>
                }
                </div>  
            </main>
        )
    }
    else {
        return (
            <main className="content">
                <CreatePlaylist playlistId = {playlistId} updateMistake = {updateMistake} updateInfo = {updateInfo}/>
            </main>
        )
    }
}

