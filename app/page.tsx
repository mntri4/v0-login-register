"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      console.log("Login attempt:", { email: formData.email, password: formData.password })
    } else {
      console.log("Register attempt:", formData)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ email: "", password: "", confirmPassword: "", name: "" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-accent/10 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-balance">
              {isLogin ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin ? "Enter your credentials to access your account" : "Fill in your details to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {isLogin && (
              <div className="mt-4 text-center">
                <Button variant="link" className="text-sm text-accent hover:text-accent/80 p-0">
                  Forgot your password?
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={toggleMode}
                className="text-sm font-medium text-accent hover:text-accent/80 p-0 mt-1 transition-all duration-300"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
