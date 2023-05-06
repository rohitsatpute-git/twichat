import React,{useState} from 'react'


function Body() {
    const [message,setMessage]= useState("rohit")
    
    return (
        <div>
           <h1>{message}</h1>
           <button onClick={()=>setMessage("kajal")}>Click</button>
        </div>
    )
}

export default Body
