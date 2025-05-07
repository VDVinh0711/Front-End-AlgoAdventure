"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const result = await login(username, password)
      
      if (result.success) {
        toast({
          title: "✅ Login successful!",
          description: "Redirecting you to the dashboard...",
          variant: "default",
          className: "bg-green-100 border-green-500 border",
        })
        
        // Router will handle the redirection based on the useEffect above
      } else if (result.error) {
        setError(result.error.message)
        toast({
          title: "❌ Login failed",
          description: result.error.message,
          variant: "destructive",
          className: "bg-red-100 border-red-500 border text-black",
          duration: 5000,
        })
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "❌ Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        className: "bg-red-100 border-red-500 border text-black",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    toast({
      title: "⚠️ Feature not available",
      description: "Registration is not implemented yet. Please contact your administrator.",
      variant: "default",
      className: "bg-yellow-100 border-yellow-500 border",
      duration: 5000,
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-4 px-4">
        <Link href="/" className="flex items-center w-fit">
          <div className="relative h-10 w-20">
            <div className="absolute inset-0 bg-rose-500 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-white ml-1" />
            </div>
            <div
              className="absolute inset-0 border-2 border-rose-500 rounded-full"
              style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
            ></div>
          </div>
          <span className="text-rose-500 font-bold ml-2 text-sm">PURUS GAMES</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-rose-500">Welcome Back!</h1>
                <p className="text-gray-600 mt-2">Sign in to access your account</p>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg border border-red-200 text-sm">
                    {error}
                  </div>
                )}
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="rounded-full">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-full">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">UserName</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your UserName"
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-sm text-rose-500 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="password" 
                        name="password"
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        className="rounded-lg" 
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input id="register-name" placeholder="John Doe" required className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  By continuing, you agree to Gametamin's{" "}
                  <Link href="#" className="text-rose-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-rose-500 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-rose-500 hover:bg-rose-100 rounded-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
