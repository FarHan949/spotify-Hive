//  global Variable
let currentSong = new Audio();
let songs;
let currentFolder;



// get song function 
async function getSong(folder){
    currentFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response
    let anchor  = div.getElementsByTagName("a")

     songs = []
    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
        if(element.href.endsWith('.mp3')){
               songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

   // show all the song in the playlist 
   let songUl = document.querySelector('.songlist').getElementsByTagName('ul')[0]
     songUl.innerHTML = ""
   for (const song of songs) {
       songUl.innerHTML = songUl.innerHTML +  `
                       <li><img class="invert" src="svg/music.svg" alt="">
                       <div class="info">
                           <div>${song.replaceAll("%20"," ").replaceAll("r%2C"," ").replaceAll("%26"," ")}</div>
                           <div>Farhan</div>
                       </div>
                       <div class="playnow">
                           <span>Play Now</span>
                           <img class="invert" src="svg/play.svg" alt="">
                       </div></li>`
   }


   // Add event listener to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach( e =>{
      e.addEventListener('click', element=>{
       //    console.log(e.querySelector(".info").firstElementChild.innerText)
          playMusic(e.querySelector(".info").firstElementChild.innerText)
      })
  })

  return songs
}




       // play audio function 
const playMusic= (audio, pause=false) =>{
    currentSong.src = `/${currentFolder}/` + audio
    if(!pause){

        currentSong.play()
        play.src = "svg/pause.svg"
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(audio)
    document.querySelector('.songtime').innerHTML = "00:00 / 00:00"
}




function secondsToMinutes(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros if needed
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return the formatted string
    return formattedMinutes + ':' + formattedSeconds;
}


async function displayAlbum(){
    let a = await fetch(`http://127.0.0.1:5500/song/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let anchor  = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchor)
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if(e.href.includes("/song/")){
            let folder = e.href.split("/").slice(-1)[0]
        

        //    get the metadata of the folder 
        let a = await fetch(`http://127.0.0.1:5500/song/${folder}/info.json`)
        let response = await a.json()
        // console.log(response)
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="weekend" class="card">
        <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 
                    19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 
                    5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 
                    9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" fill="#000" stroke-width="1.5" 
                    stroke-linejoin="round" />
                </svg> 
        </div>
            <img src="/song/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
       </div>`
    } 
        
    }
    // load the playlist if card was clicked 
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener('click', async item=>{
            songs = await getSong(`song/${item.currentTarget.dataset.folder}`)
            
        })
    })
}



// main logic here 
async function main(){

    // get the list of the all song 
     await getSong(`song/cps`)
    // console.log(songs)

    playMusic(songs[0], true)

    // All albums are shown on the display
       displayAlbum()


// Add event listener to play song  
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "svg/play.svg"
        }
    })  
      
    // Add event listener to  previous and next
    previous.addEventListener('click', ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //    console.log('clicked next',index)
       if((index-1) >= 0){

           playMusic(songs[index-1])
       }
    })


    next.addEventListener('click', () => {

        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log('clicked next', index);
        if ((index + 1)  < songs.length) {
            playMusic(songs[index + 1]); // Play the first song if index is not found or if it's the last song
        }
    });
    

//   Time update event 
      currentSong.addEventListener("timeupdate", ()=>{

          if(!isNaN(currentSong.duration)){
            
            document.querySelector(".songtime").innerHTML = `
            ${secondsToMinutes(parseInt(currentSong.currentTime))} /
            ${secondsToMinutes(parseInt(currentSong.duration))}`
            document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
          }
      })


    //   add an event listener to seekbar 
    document.querySelector(".seekbar").addEventListener('click', (e)=>{
       let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
       document.querySelector(".circle").style.left = percent + "%"
    
       currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    //  add event listener for hamburger and open song library
    document.querySelector(".hamburger").addEventListener('click', ()=>{
    document.querySelector(".left").style.left = "0"
    })
    //  add event listener for close || close the library 
    document.querySelector(".close").addEventListener('click', ()=>{
    document.querySelector(".left").style.left = "-130%"
    document.querySelector(".left").style.transition = "all 1s"
    })
     
    // add event listener to volume 
    document.querySelector(".rang").getElementsByTagName("input")[0].addEventListener('change', (e)=>{
        // console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value)/100
        // if (currentSong.volume > 0){
        //     document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("svg/mute.svg", "volume.svg")
        // }
    }) 

    
    
}

main()