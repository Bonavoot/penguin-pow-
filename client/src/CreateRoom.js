import { useState } from "react"
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const CreateRoom = ({onBack}) => {
    const [roomName, setRoomName] = useState("")

    const handleCreateRoom = () => {
        socket.emit('createRoom', roomName)
    }
    
    return(
        <>
         <label className="create-room-label">ROOM NAME:</label>
         <input className="create-room-input" onChange={(e) => setRoomName(e.target.value)} type='text' />
         <button className="create-room" onClick={handleCreateRoom}>CREATE ROOM</button>
         <button className="back" onClick={onBack}>BACK</button>
        </>
    )
}

export default CreateRoom;