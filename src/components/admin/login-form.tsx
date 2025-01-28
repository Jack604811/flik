"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { Alert, AlertDescription } from "../ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    try {
        const res = await signIn("admin-signin", {
          email,
          password,
          redirect: false,
          callbackUrl: `/dashboard`,
        });
  
        if (res?.error) {
          setError(res.error);
        } else if (res?.ok && res.url) {
          router.push(res.url);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-4 text-start">
        <h1 className="text-2xl font-semibold">Flik Admin Login</h1>
        <p className="text-muted-foreground text-sm">
          Please enter your email and password to login.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        
        <div className="space-y-4 py-5">
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
        </div>
        <div className="flex-col">
          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
            } dark:text-black`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription className="text-red-500 text-sm text-center">{error}</AlertDescription>
          </Alert>
          )}
        </div>
      </form>
    </div>
  )
}

