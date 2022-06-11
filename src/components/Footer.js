import { useEffect, useState } from 'react'
import Api from '../utils'

export default function Footer(props) {
    const[track, setTrack] = useState(null)
    useEffect(()=>{
        if (props.infoTrack != null)
        Api.getTrack(props.infoTrack).then((track)=> setTrack(track))
    }, [props.infoTrack]) 
    return (
        <footer className = "footer">
            {
                track ? 
                <>
                    <div className = "trackName">
                        <img src={track.album.images[0].url} width="80" height="80" />
                    </div>
                    <div className = "trackInfo">
                        <h4>{track.name}</h4>{track.artists[0].name}
                        <br />
                        popularity: {track.popularity}
                    </div>                    
                </> : null
            }
        </footer>
    )
}