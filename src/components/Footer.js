
import Api from '../utils'
import useLoginStatus from './useLoginStatus'

export default function Footer(props) {
    const { data, isLoading, error } = useLoginStatus(props.infoTrack,  Api.getTrack);

    if (error) return <footer className = "footer">Ошибка! Найти песню не удалось</footer>
    if (isLoading) return <footer className = "footer">Loading....</footer>
    return (
        <footer className = "footer">
            {
                data ? 
                <>
                    <div className = "trackName">
                        <img alt ="cover of the song" src={data.album.images[0].url} width="80" height="80" />
                    </div>
                    <div className = "trackInfo">
                        <h4>{data.name}</h4>{data.artists[0].name}
                        <br />
                        popularity: {data.popularity}
                    </div>                    
                </> : null
            }
        </footer>
    )
}