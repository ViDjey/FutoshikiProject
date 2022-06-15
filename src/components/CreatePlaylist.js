import useLoginStatus from './useLoginStatus'
import Api from '../utils'


export default function CreatePlaylist(props){

    const { data, isLoading, error } = useLoginStatus(props.playlistId,  Api.getTracks);

    if (error) return <div className = "descriptionPlaylist">Ошибка! Найти плэйлист не удалось</div>
    if (isLoading) return <div className = "descriptionPlaylist">Loading....</div>
    if (data != null ){
        return (
        <div className = "descriptionPlaylist">
            <br />
            <img alt = "playlist poster" src = {data.images[0].url} />
            <h1 id = "namePlaylist">{data.name}</h1>
            <br />
            <h2> ~ {data.description}</h2>
            <hr />
            <div className = "searchTracks">
                {
                    data.tracks.items.map(element => { 
                        return (
                            <div className = "track"
                                key={element.track.id}
                                onClick={(event)=>{
                                    if (event.target.tagName === 'P'){
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