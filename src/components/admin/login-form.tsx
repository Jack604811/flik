"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate credentials against your backend
    if (email === "admin@flik.com" && password === "password") {
      // Set a token in localStorage (this should be more secure in a real app)
      localStorage.setItem("flikAdminToken", "dummy_token")
      router.push("/dashboard")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 py-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Log in</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

