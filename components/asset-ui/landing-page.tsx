"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Users, CreditCard, CheckCircle, Star, Zap, Globe, Lock, TrendingUp } from 'lucide-react'
import Image from "next/image"
import AuthModal from "./auth-modal"

const features = [
  {
    icon: Users,
    title: "Employee Self-Service",
    description: "Karyawan dapat mengajukan klaim dengan mudah dan melacak status secara real-time"
  },
  {
    icon: Shield,
    title: "HR Management",
    description: "Tim HR dapat mereview dan menyetujui klaim dengan workflow yang terstruktur"
  },
  {
    icon: CreditCard,
    title: "Finance Processing",
    description: "Tim Finance dapat memproses pembayaran dengan sistem yang terintegrasi"
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Notifikasi dan update status klaim secara real-time untuk semua pihak"
  },
  {
    icon: Lock,
    title: "Secure & Compliant",
    description: "Keamanan data tingkat enterprise dengan compliance standar industri"
  },
  {
    icon: TrendingUp,
    title: "Analytics & Reporting",
    description: "Dashboard analytics dan laporan komprehensif untuk insight bisnis"
  }
]

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const handleGetStarted = () => {
    setAuthMode('register')
    setShowAuthModal(true)
  }

  const handleSignIn = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-2">
              <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                <Image
                  src="/pt_sarana_pactindo_cover.jpg"
                  alt="PT Sarana Pactindo Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PT Sarana Pactindo
              </span>
            </div>


            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleSignIn}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Masuk
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Daftar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 px-4 py-2">
              📋 Sistem Manajemen Klaim Perusahaan
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Kelola Klaim
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Karyawan <br /> </span>
              dengan Mudah
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Sistem terintegrasi untuk mengelola klaim karyawan dari pengajuan hingga pembayaran.
              Memungkinkan pengelolaan workflow HR, Finance, dan Employee dalam satu platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
              >
                Masuk Sistem
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Fitur Lengkap untuk Semua Pengguna
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dari karyawan hingga finance, semua mendapat tools yang mereka butuhkan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-800"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                <Image
                  src="/pt_sarana_pactindo_cover.jpg"
                  alt="PT Sarana Pactindo Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">
                PT Sarana Pactindo
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025. PT Sarana Pactindo. all rights reserved.
            </div>
          </div>
        </div>
      </footer>


      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  )
}
