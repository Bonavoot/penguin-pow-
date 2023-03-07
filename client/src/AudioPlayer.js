import ReactAudioPlayer from "react-audio-player"
import music from "./assets/peteyPirana.mp3"

const AudioPlayer = () => {
    
    return ( 
    <ReactAudioPlayer src={music} autoPlay loop />
    );

}


export default AudioPlayer