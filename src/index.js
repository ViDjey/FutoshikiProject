const redirect_uri = "http://localhost:3000";
const client_id = '0b4fbd03ced346d1be5b9cff118a543e';
const client_secret = 'a5734ed330194687a90f6b75f10eae2a';
const address_genres = 'https://api.spotify.com/v1/browse/categories?locale=sv_RU&limit=30';
const akk = document.getElementById('list-group');
const header = document.getElementsByClassName('header')[0];

let access_token = null;

const searchData = async (url) => {
    const result = await fetch(url, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + access_token
        }
    });
    return result.json();
}

/**получает токен для дальнейших операций*/
const getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: 'grant_type=client_credentials'
    }).catch(err => alert(err));
    const data = await result.json();
    if (data.access_token == undefined) {
        console.log("Ошибка получения токена");
    }
    else {
        access_token = data.access_token;
        getGenres();
    }
}

/**получает список жанров*/
const getGenres = async () => {
    const data = await searchData(address_genres);
    createGenres(data);
}

/**получает список плэйлистов по жанру*/
const getPlaylistByGenre = async (genreId, target) => {
    const data = await searchData(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=10`);
    if (data.playlists.items!= undefined) {
        createPlaylistByGenre(data.playlists.items, target);
    }
    else console.log("Ошибка");
}

/**получение треков в альбоме*/
const getTracks = async (playlist_id) => {
    const data = await searchData(`https://api.spotify.com/v1/playlists/${playlist_id}`);
    createPlaylist(data);
}

/**получение информации о треке*/
const getTrack = async (track_id) => {
    const data  = await searchData(`https://api.spotify.com/v1/tracks/${track_id}`);
    createNewFooter(data);
}

/**генерирует представление жанров на экран*/
function createGenres(genres){
    
    if (genres.categories.items != undefined) {
        var html = '';
        genres.categories.items.forEach(element => {
            html += `<button class="genres" data="${element.id}" style="background-color: ${getRandomColor()};">${element.name}</button>`;
            
        });
        akk.insertAdjacentHTML('beforeend', html);
        const buttonArr = document.getElementsByClassName('genres');
        for (let element of buttonArr) {
            getPlaylistByGenre(element.getAttribute('data'), element);
        }
    }
    else console.log("Ошибка получения списка жанров");
}

/**генерирует список плэйлистов по жанрам*/
function createPlaylistByGenre(playlists, target){
    if (playlists != undefined) {
        let html2 = '<ul class="playlists">';
        if (playlists.length > 0){
            playlists.forEach(element => {
                html2 += `<li class="playlist" data="${element.id}">${element.name}</li>`;
            });
        }
        else html2 += '<p>К сожалению, плейлисты не найдены</p>';
        target.insertAdjacentHTML('beforeend', html2+'</ul>');
        const elem = target.getElementsByClassName('playlists')[0];
        elem.addEventListener('click', ({target}) => {
            if (target.tagName == 'LI'){
                getTracks(target.getAttribute('data'));
            }
        });
    }
    else console.log("Ошибка");
}

/**отображени информации о плейлисте*/
function createPlaylist(data){
    header.innerHTML = "<button class='button_small'>&#8617;</button>";
    const back = header.getElementsByClassName('button_small')[0];
    back.addEventListener('click', ({target}) => {
        if (target.tagName == 'BUTTON'){
            akk.innerHTML = "";
            header.innerHTML = "";
            getGenres();
        }
    });
    let htmlCode = `<br /><img src="${data.images[0].url}"</img>`+
    `<h1 id="namePlaylist">${data.name}</h1><br /><h2> ~ ${data.description}</h2><hr /><div class="searchTracks">`;
    data.tracks.items.forEach((element => 
        {
            htmlCode += `<div class="track" data="${element.track.id}">&#9654 ${element.track.name}<p class="info">&#128712;</p></div>`
        }
        ));
    akk.innerHTML = '<div class="descriptionPlaylist">'+ htmlCode +'</div></div>';
    const elem = document.getElementsByClassName('searchTracks')[0];
    elem.addEventListener('click', ({target}) => {
        if (target.tagName == 'DIV'){
            header.innerHTML = "<button class='button_small'>&#8617;</button>";
            header.insertAdjacentHTML("beforeend",'<p id="mistake">! Player command failed: Premium required !</p>');
        }
    });
    elem.addEventListener('click', ({target}) => {
        if (target.tagName == 'P'){
            getTrack(target.parentNode.getAttribute('data'));
        }
    });
}

/**отображение информации о треке в футере */
function createNewFooter(infoTrack){
    const imgTrack = document.getElementsByClassName('trackName')[0]; 
    const fragmentInfo = document.getElementsByClassName('trackInfo')[0];
    fragmentInfo.innerHTML = `<h4>${infoTrack.name}</h4>${infoTrack.artists[0].name}<br>popularity: ${infoTrack.popularity}`;
    imgTrack.innerHTML = `<img src="${infoTrack.album.images[0].url}" width="80" height="80"></img>`;
};

/**генерация цвета для контейнеров жанров*/
function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var randomColor = "#";
    for (var i = 0; i < 6; i++) {
      randomColor += letters[Math.floor(Math.random() * letters.length)];
    }
    return randomColor;
  }

 getToken();


