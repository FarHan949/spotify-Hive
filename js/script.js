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
               songs.push(element.href)
        }
    }
    return songs
}

async function main(){
    // get the list of the all song 
    let song = await getSong()
    console.log(song)

    // play the first song 
    var audio = new Audio(song[0])
    audio.play()
}
main()