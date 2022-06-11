import { useEffect, useState } from 'react'
import Api from '../utils'

export default function CreateGenres(props){
    const[playlists, setPlaylists] = useState(null)
    useEffect(()=>{
        if (props.genreId != null)
        Api.getPlaylistByGenre(props.genreId).then((playLists)=>setPlaylists(playLists))
    }, []) 
        if (playlists != null ){
            return <ul className="playlists">
                {playlists.map(element => { 
                    return element ? 
                     (<li className = "playlist" 
                    key={element.id}
                    onClick={()=>props.updateData(element.id)}
                    > {element.name} </li>) : null
                 })}
            </ul>}
        else return (<ul className="playlists"><li>К сожалению, плейлисты не найдены</li></ul>)
}