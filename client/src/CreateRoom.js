import { useState } from "react"
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const CreateRoom = ({onBack}) => {
    const [roomName, setRoomName] = useState("")

    const handleCreateRoom = () => {
        socket.emit('createRoom', roomName)
    }
    
    return(
        <div className="create-room">
         <input className="create-room-input" placeholder="CREATE ROOM" onChange={(e) => setRoomName(e.target.value)} type='text' />
         <button className="create-room-btn" onClick={handleCreateRoom}>CREATE ROOM</button>
         <button className="back" onClick={onBack}>BACK</button>
        </div>
    )
}

export default CreateRoom;