class Api {
    private static client_id = '0b4fbd03ced346d1be5b9cff118a543e';
    private static client_secret = 'a5734ed330194687a90f6b75f10eae2a';
    private static access_token: string = "";

    private static searchData = async (url: string) => {
        const result = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + Api.access_token
            }
        });
        if (result.ok) { 
            return await result.json();
        } else {
            return null;
        }
       
    }
    /**получает токен для дальнейших операций*/
    static getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(Api.client_id + ':' + Api.client_secret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        Api.access_token = await data.access_token;
        return data.access_token;
    }

    /**получает список жанров*/
    static getGenres = async () => {
        await Api.getToken();
        const data = await Api.searchData('https://api.spotify.com/v1/browse/categories?locale=sv_RU&limit=30');
        return data.categories.items;
    }

    /**получает список плэйлистов по жанру*/
    static getPlaylistByGenre = async (genreId: string) => {
        const data = await Api.searchData(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=10`);
        if (data != null) return data.playlists.items;
         else return null;
    }

    /**получение треков в альбоме*/
    static getTracks = async (playlist_id: string) => {
        const data = await Api.searchData(`https://api.spotify.com/v1/playlists/${playlist_id}`);
        return data;
    }

    /**получение информации о треке*/
    static getTrack = async (track_id: string) => {
        const data  = await Api.searchData(`https://api.spotify.com/v1/tracks/${track_id}`);
        return data;
    }
 }
 
 export default Api;