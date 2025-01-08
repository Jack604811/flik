import { LoginForm } from "@/components/admin/login-form"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Flik Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}

