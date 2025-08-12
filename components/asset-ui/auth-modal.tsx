"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Eye, EyeOff, User, Mail, Lock, Phone, BadgeIcon as IdCard } from 'lucide-react'
import { useRouter } from "next/navigation"

interface AuthModalProps {
  mode: 'login' | 'register'
  onClose: () => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  nik: string
  phone: string
  role: string
}

const ROLES = [
  { 
    id: "employee", 
    name: "Employee", 
    description: "Karyawan yang mengajukan klaim",
    redirectTo: "/employee/dashboard"
  },
  { 
    id: "hr", 
    name: "HR", 
    description: "Human Resources untuk review klaim",
    redirectTo: "/hr/dashboard"
  },
  { 
    id: "finance", 
    name: "Finance", 
    description: "Tim Finance untuk proses pembayaran",
    redirectTo: "/finance/dashboard"
  }
]

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nik: "",
    phone: "",
    role: ""
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (mode === 'register') {
      console.log("Register data:", {
        id: crypto.randomUUID(),
        name: formData.name,
        nik: parseInt(formData.nik),
        phone: parseInt(formData.phone),
        email: formData.email,
        password: formData.password,
        role: formData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } else {
      console.log("Login data:", { 
        email: formData.email, 
        password: formData.password 
      })
    }

    // Redirect based on role (for register) or default dashboard (for login)
    let redirectPath = "/dashboard"
    if (mode === 'register') {
      const selectedRole = ROLES.find(role => role.id === formData.role)
      redirectPath = selectedRole?.redirectTo || "/dashboard"
    } else {
      // For login, you might want to get role from API response
      redirectPath = "/employee/dashboard" // Default, should be determined by API
    }
    
    setIsLoading(false)
    onClose()
    router.push(redirectPath)
  }

  const isFormValid = () => {
    if (mode === 'login') {
      return formData.email && formData.password
    } else {
      return formData.name && 
             formData.email && 
             formData.password && 
             formData.confirmPassword && 
             formData.nik && 
             formData.phone && 
             formData.role &&
             formData.password === formData.confirmPassword
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-md max-h-[90vh] shadow-2xl flex flex-col">
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {mode === 'login' 
                ? 'Masuk ke sistem KlaimKu' 
                : 'Daftar untuk menggunakan KlaimKu'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {mode === 'login' ? (
              // Login Form - Only Email and Password
              <>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Masukkan email Anda"
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Masukkan password Anda"
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12 pr-12"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Register Form - All Database Fields
              <>
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Lengkap *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      maxLength={100}
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* NIK */}
                <div className="space-y-2">
                  <Label htmlFor="nik" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    NIK *
                  </Label>
                  <div className="relative">
                    <Input
                      id="nik"
                      type="number"
                      value={formData.nik}
                      onChange={(e) => handleInputChange("nik", e.target.value)}
                      placeholder="Masukkan NIK"
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12"
                    />
                    <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor Telepon *
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Masukkan nomor telepon"
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Masukkan email"
                      maxLength={150}
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Pilih role Anda" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="py-2">
                            <div className="font-medium">{role.name}</div>
                            <div className="text-xs text-gray-500">{role.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Masukkan password"
                      maxLength={255}
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12 pr-12"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Konfirmasi Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Konfirmasi password"
                      className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12 pr-12"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Password tidak cocok
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading 
                  ? (mode === 'login' ? 'Sedang Masuk...' : 'Membuat Akun...') 
                  : (mode === 'login' ? 'Masuk' : 'Buat Akun')
                }
              </Button>
            </div>

            {/* Switch Mode */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
                <button
                  type="button"
                  onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {mode === 'login' ? 'Daftar' : 'Masuk'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
