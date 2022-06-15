import { useState, useEffect } from 'react'
export default function useLoginStatus(id,  fun) {
    const[ data, setPlaylists ] = useState(null)
    const [ isLoading, setLoading ] = useState()
    const [ error, setHasError ] = useState(false)

    useEffect(()=>{
        setLoading(true)
        if (id != null){
            if ("genres" === id) {
                fun().then((data)=>{
                    if (data == null) setHasError(true)
                    setPlaylists(data)
                    setLoading(false)
                })
            }
            else {
                fun(id).then((data)=>{
                    if (data == null) setHasError(true)
                    setPlaylists(data)
                    setLoading(false)
                })
            }
        } else setLoading(false)
    }, [id, fun])
    return { data, isLoading, error};
}
