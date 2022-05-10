/*
Здравствуйте! У меня не получается самостоятельно разобраться с подключением к Spotify API,
это похоже на шутку, из одного места все работает, но стоит поменять место вызова функции, то ломается подключение.
С функцией вывода альбома нет проблем, а другая - написанная аналогично при одинаковых данных ломается,
 подскажите, пожалуйста, что не так? А то я совсем запуталась
*/
var playpause_btn = document.getElementById('play');
var next_btn = document.getElementById('next');
var previous_btn = document.getElementById('previous');
var player = document.getElementById('player');
var akk = document.getElementsByClassName('buttonEnter')[0];
var akk = document.getElementsByClassName('buttonEnter')[0];
const redirect_uri = "http://localhost:3000";
const client_id = '0b4fbd03ced346d1be5b9cff118a543e';
const client_secret = 'a5734ed330194687a90f6b75f10eae2a';

let access_token = null;

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";

//Авторизация
function requestAuthorization(){
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=false";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url;
}

function handleRedirect(){
    let code = getCode();
    window.history.pushState("", "", redirect_uri);
    getToken(code);
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function fetchAccessToken(code){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    getToken(body);
}

/*function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;

}*/
//Получение токена, вызов функций
const getToken = async (code) => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret),
            'Content-Type' : 'application/x-www-form-urlencoded' 
        },
        body: code
    });
    if ( result.status == 200 ){
        var data = result.json();
        console.log(data);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }        
        const genres = getGenres(access_token);
        genres.then(res => {console.log(res)});
        const albums = getAlbum(access_token);
        albums.then(res => {console.log(res)});
    }
    else {
        console.log(result.body);
        alert(result.body);
    }
}
/*
function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}*/

const getGenres = async (token) => {
    const result = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token
        }
    });
    const data = await result.json();
    return data;
}

const getAlbum = async (token) => {
    const result = await fetch('https://api.spotify.com/v1/albums/1lXY618HWkwYKJWBRYR4MK', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token
        }
    });
    const data = await result.json();
    return data;
}
const getPlaylistByGenre = async (token, genreId) => {

    const limit = 10;
    
    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.playlists.items;
}

const getTracks = async (token, tracksEndPoint) => {

    const limit = 10;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.items;
}

const getTrack = async (token, trackEndPoint) => {

    const result = await fetch(`${trackEndPoint}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data;
}


akk.addEventListener("click", () => {
    requestAuthorization()
})

var akks = document.getElementsByClassName('buttonReg')[0];
akks.addEventListener("click", () => {
    handleRedirect()
    /*const genres = getGenres(access_token);
    genres.then(res => {console.log(res)});
    const albums = getAlbum(access_token);
    albums.then(res => {console.log(res)});*/
    //const playlist =getPlaylistByGenre(access_token)
    //getToken();
})

/*function createGenre(text, value) {
    const html = `<button class="card_something" value="${value}">${text}</button>`;
    document.querySelector(document.getElementsByClassName('list-group')[0]).insertAdjacentHTML('beforeend', html);
}

function createPlaylist(text, value) {
    const html = `<p value="${value}">${text}</p>`;
    document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
}

function createTrack(id, name) {
    const html = `<a href="#" id="${id}">${name}</a>`;
    document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
}


function createTrackDetail(img, title, artist) {
    const detailDiv = document.querySelector(DOMElements.divSonglist);
    detailDiv.innerHTML = '';
    const html = 
    `<a href="/" class="card_something">
        <img src="${img}" width="145" height="145">
        <h4>${title}</h4>
        <p>${artist}</p>
    </a>`;

    detailDiv.insertAdjacentHTML('beforeend', html)
}
*/
