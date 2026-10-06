'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/dashboard'
  }



  const handleSignup = async () => {
  if (!email || !password) {
    alert('Please enter both email and password')
    return
  }
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) alert(error.message)
  else alert('Check your email')
}
 console.log("URL CHECK:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border border-gray-300 rounded px-3 py-2 w-full mb-2" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="border border-gray-300 rounded px-3 py-2 w-full mb-2"/>
      <br></br>
      <button onClick={handleLogin}>Log In</button>
      <br></br>
      <button onClick={handleSignup}>Register</button>
      </div>
  )
}