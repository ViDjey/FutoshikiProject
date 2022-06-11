/* Прошу, пожалуйста, обратите внимание.
 Я хочу уточнить по поводу прошлого этапа, Вы не заметили мой комментарий к Вашему замечанию.
 Мне написали, что один из обработчиков не будет работать:
 "не понимаю зачем тут два обработчика, searchTracks это всегда div вроде бы, т.е. второй обработчик никогда не выполняется"
  но searchTracks это <div>, внутри которого есть <p>
   * при нажатии на сам <div> был вывод ошибки,
   * а по тегу <p> внутри этого <div> был вывод информации о треке в футер. Все работало, тут есть такой же момент:)*/
import { useEffect, useState } from 'react'
import Api from '../utils'


export default function CreatePlaylist(props){
    const[tracks, setTracks] = useState(null)
    useEffect(()=>{
        if (props.playlistId != null)
        Api.getTracks(props.playlistId).then((tracks)=>setTracks(tracks))
    }, []) 
    if (tracks != null ){
        return (
        <div className = "descriptionPlaylist">
            <br />
            <img src = {tracks.images[0].url} />
            <h1 id = "namePlaylist">{tracks.name}</h1>
            <br />
            <h2> ~ {tracks.description}</h2>
            <hr />
            <div className = "searchTracks">
                {
                    tracks.tracks.items.map(element => { 
                        return (
                            <div className = "track"
                                key={element.track.id}
                                onClick={(event)=>{
                                    if (event.target.tagName == 'P'){
                                        props.updateInfo(element.track.id)
                                    }
                                    else props.updateMistake(true)}
                                }>
                                &#9654; {element.track.name}
                                <p className = "info">&#128712;</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>)
    }
    else return (<p>К сожалению, плейлист не найден</p>)
}