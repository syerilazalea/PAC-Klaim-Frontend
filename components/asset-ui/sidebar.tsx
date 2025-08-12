"use client"

import { BarChart2, Receipt, Building2, CreditCard, Folder, Wallet, Users2, Shield, MessagesSquare, Video, Settings, HelpCircle, Menu, ChevronDown, ChevronRight, DollarSign, FileCheck, History, UserCheck, ClipboardList, User } from 'lucide-react'

import { Home } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['finance'])
  const pathname = usePathname()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function toggleMenu(menuId: string) {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    isActive = false
  }: {
    href: string
    icon: any
    children: React.ReactNode
    isActive?: boolean
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive 
            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]'
        }`}
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  function MenuSection({
    title,
    menuId,
    icon: Icon,
    children
  }: {
    title: string
    menuId: string
    icon: any
    children: React.ReactNode
  }) {
    const isExpanded = expandedMenus.includes(menuId)
    
    return (
      <div>
        <button
          onClick={() => toggleMenu(menuId)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23] rounded-md transition-colors"
        >
          <div className="flex items-center">
            <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
            {title}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="#landing-page.tsx"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/pt_sarana_pactindo_cover.jpg"
                alt="Acme"
                width={35}
                height={35}
                className="flex-shrink-0 hidden dark:block"
              />
              <Image
                src="/pt_sarana_pactindo_cover.jpg"
                alt="Acme"
                width={35}
                height={35}
                className="flex-shrink-0 block dark:hidden"
              />
              <span className="text-md font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                PT Sarana Pactindo
              </span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              
              {/* Finance Menu */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Finance
                </div>
                <div className="space-y-1">
                  <MenuSection title="Finance" menuId="finance" icon={DollarSign}>
                    <NavItem href="/finance/dashboard" icon={BarChart2} isActive={pathname === '/finance/dashboard'}>
                      Dashboard
                    </NavItem>
                    <NavItem href="/finance/payments" icon={CreditCard} isActive={pathname === '/finance/payments'}>
                      Payments
                    </NavItem>
                    <NavItem href="/finance/payment-history" icon={History} isActive={pathname === '/finance/payment-history'}>
                      Payment History
                    </NavItem>
                  </MenuSection>
                </div>
              </div>

              {/* HR Menu */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Human Resources
                </div>
                <div className="space-y-1">
                  <MenuSection title="HR" menuId="hr" icon={UserCheck}>
                    <NavItem href="/hr/dashboard" icon={BarChart2} isActive={pathname === '/hr/dashboard'}>
                      Dashboard
                    </NavItem>
                    <NavItem href="/hr/reviews" icon={FileCheck} isActive={pathname === '/hr/reviews'}>
                      Reviews
                    </NavItem>
                    <NavItem href="/hr/review-history" icon={History} isActive={pathname === '/hr/review-history'}>
                      Review History
                    </NavItem>
                  </MenuSection>
                </div>
              </div>

              {/* Employee Menu */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Employee
                </div>
                <div className="space-y-1">
                  <MenuSection title="Employee" menuId="employee" icon={User}>
                    <NavItem href="/employee/dashboard" icon={BarChart2} isActive={pathname === '/employee/dashboard'}>
                      Dashboard
                    </NavItem>
                    <NavItem href="/employee/claims" icon={ClipboardList} isActive={pathname === '/employee/claims'}>
                      Claims
                    </NavItem>
                    <NavItem href="/employee/claim-history" icon={History} isActive={pathname === '/employee/claim-history'}>
                      Claim History
                    </NavItem>
                  </MenuSection>
                </div>
              </div>
              
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="#" icon={Settings}>
                Settings
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
