import { useState } from "react";

const JoinRoom = ({onSubmit, onBack}) => {
const [roomId, setRoomId] = useState("")

const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(roomId)
}

return (
    <>
    <form onSubmit={handleSubmit}>
     <label htmlFor="room-id">ROOM ID:</label>
     <input id="room-id" value={roomId} onChange={(e) => setRoomId(e.target.value)} type='text' />
     <button type="submit" className="join-room-btn">JOIN ROOM</button>
     </form>
     <button className="back" onClick={onBack}>BACK</button>
    </>
 )
}

export default JoinRoom;