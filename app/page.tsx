"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock, Mail, Eye, EyeOff, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HomePage() {
  const router = useRouter()
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  })

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
  })

  useEffect(() => {
    // Redirect to buildings page as default authenticated page
    router.push("/buildings")
  }, [router])

  const openModal = (modal: string) => {
    setActiveModal(modal)
    setMessage(null)
  }

  const closeModal = () => {
    setActiveModal(null)
    setMessage(null)
    setSignUpForm({ email: "", password: "", confirmPassword: "" })
    setSignInForm({ email: "", password: "" })
    setForgotPasswordForm({ email: "" })
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUpForm.email || !signUpForm.password || !signUpForm.confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" })
      return
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" })
      return
    }
    if (signUpForm.password.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu phải có ít nhất 6 ký tự" })
      return
    }
    setMessage({ type: "success", text: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản." })
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signInForm.email || !signInForm.password) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" })
      return
    }
    setMessage({ type: "success", text: "Đăng nhập thành công!" })
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotPasswordForm.email) {
      setMessage({ type: "error", text: "Vui lòng nhập địa chỉ email" })
      return
    }
    setMessage({ type: "success", text: "Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn." })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black">Đang chuyển hướng...</h1>
      </div>

      {/* Sign Up Modal */}
      <Dialog open={activeModal === "signup"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black text-center">Đăng ký tài khoản</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-lg font-semibold text-black">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                  className="pl-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                  title="Nhập địa chỉ email hợp lệ để tạo tài khoản"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-lg font-semibold text-black">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                  className="pl-12 pr-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                  title="Mật khẩu phải có ít nhất 6 ký tự"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-black" /> : <Eye className="h-5 w-5 text-black" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password" className="text-lg font-semibold text-black">
                Xác nhận mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={signUpForm.confirmPassword}
                  onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                  className="pl-12 pr-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                  title="Nhập lại mật khẩu để xác nhận"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-black" />
                  ) : (
                    <Eye className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
            </div>

            {message && (
              <Alert
                className={`border-2 ${message.type === "success" ? "border-[#38A169] bg-[#38A169]/10" : "border-[#E53E3E] bg-[#E53E3E]/10"}`}
              >
                <Info className="h-5 w-5" />
                <AlertDescription
                  className={`text-lg font-semibold ${message.type === "success" ? "text-[#38A169]" : "text-[#E53E3E]"}`}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
            >
              Tạo tài khoản
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign In Modal */}
      <Dialog open={activeModal === "signin"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black text-center">Đăng nhập</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-lg font-semibold text-black">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                  className="pl-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                  title="Nhập email đã đăng ký"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-lg font-semibold text-black">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  value={signInForm.password}
                  onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                  className="pl-12 pr-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                  title="Nhập mật khẩu tài khoản"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-black" /> : <Eye className="h-5 w-5 text-black" />}
                </button>
              </div>
            </div>

            {message && (
              <Alert
                className={`border-2 ${message.type === "success" ? "border-[#38A169] bg-[#38A169]/10" : "border-[#E53E3E] bg-[#E53E3E]/10"}`}
              >
                <Info className="h-5 w-5" />
                <AlertDescription
                  className={`text-lg font-semibold ${message.type === "success" ? "text-[#38A169]" : "text-[#E53E3E]"}`}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
            >
              Đăng nhập
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={activeModal === "forgot"} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black text-center">Quên mật khẩu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-lg font-semibold text-black">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Nhập email để nhận hướng dẫn đặt lại mật khẩu"
                  value={forgotPasswordForm.email}
                  onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, email: e.target.value })}
                  className="pl-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                  title="Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu"
                />
              </div>
            </div>

            {message && (
              <Alert
                className={`border-2 ${message.type === "success" ? "border-[#38A169] bg-[#38A169]/10" : "border-[#E53E3E] bg-[#E53E3E]/10"}`}
              >
                <Info className="h-5 w-5" />
                <AlertDescription
                  className={`text-lg font-semibold ${message.type === "success" ? "text-[#38A169]" : "text-[#E53E3E]"}`}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
            >
              Gửi hướng dẫn
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
