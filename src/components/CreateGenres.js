
import Api from '../utils'
import useLoginStatus from './useLoginStatus'

export default function CreateGenres(props){
    const { data, isLoading, error } = useLoginStatus(props.genreId,  Api.getPlaylistByGenre);

    if (isLoading){return <ul className="playlists"><li>Loading....</li></ul>}
    if (error){return <ul className="playlists"><li>К сожалению, плейлисты не найдены</li></ul>}
    else {
        if (data != null ){
            return <ul className="playlists">
                {data.map(element => { 
                    return element ? 
                     (<li className = "playlist" 
                    key={element.id}
                    onClick={()=>props.updateData(element.id)}
                    > {element.name} </li>) : null
                 })}
            </ul>}
        else 
         return (<ul className="playlists"><li>К сожалению, плейлисты не найдены</li></ul>)
        }
}