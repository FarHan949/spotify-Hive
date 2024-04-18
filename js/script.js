console.log('lets go')

async function getSong(){
    let a = await fetch("http://127.0.0.1:5500/song/")
    let response = await a.text()
    // console.log(response)

    let div = document.createElement('div')
    div.innerHTML = response
    let anchor  = div.getElementsByTagName("a")
    // console.log(anchor)

    let songs = []
    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
        if(element.href.endsWith('.mp3')){
               songs.push(element.href.split("/song/")[1])
        }
    }
    return songs
}

async function main(){
    // get the list of the all song 
    let songs = await getSong()
    console.log(songs)

    let songUl = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +  `<li>${song.replaceAll("%20"," ")}</li>`
    }
    // play the first song 
    var audio = new Audio(songs[4])
    // audio.play()

    audio.addEventListener("loadeddata", ()=>{
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
    })
}
main()