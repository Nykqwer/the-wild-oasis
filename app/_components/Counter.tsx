"use client"

import { useState } from "react"
import { User } from "../cabins/page"

type CounterProps = {
  users: User[]

}

export default function Counter({ users }: CounterProps) {
  const [count, setCount] = useState(0)

  
 

  return (
    <div>
        <p>There are {users.length} users</p>
  
    <button onClick={() => setCount((prev) => prev + 1)}>
      {count}
      
    </button>
    </div>
  )
}
