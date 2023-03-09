import { useState } from "react";

const JoinRoom = ({onBack}) => {
const [roomId, setRoomId] = useState("")



return (
    <div className="create-room">
     <input placeholder="ROOM NAME" className="create-room-input" value={roomId} onChange={(e) => setRoomId(e.target.value)} type='text' />
     <button type="submit" className="create-room-btn">JOIN ROOM</button>
     <button className="back" onClick={onBack}>BACK</button>
    </div>
 )
}

export default JoinRoom;