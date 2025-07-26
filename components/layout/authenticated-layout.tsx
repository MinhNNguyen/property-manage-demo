"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Users, FileText, Activity, Menu, X } from "lucide-react"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  tooltip: string
}

const navigationItems: NavigationItem[] = [
  {
    name: "Tòa nhà",
    href: "/buildings",
    icon: Building2,
    tooltip: "Quản lý các tòa nhà và căn hộ",
  },
  {
    name: "Khách thuê",
    href: "/tenants",
    icon: Users,
    tooltip: "Quản lý thông tin khách thuê",
  },
  {
    name: "Hóa đơn",
    href: "/invoices",
    icon: FileText,
    tooltip: "Quản lý hóa đơn và thanh toán",
  },
  {
    name: "Hoạt động",
    href: "/activities",
    icon: Activity,
    tooltip: "Xem lịch sử hoạt động hệ thống",
  },
]

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b-2 border-black">
        <h1 className="text-2xl font-bold text-black">PropertyApp</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200
                    ${isActive ? "bg-[#1E90FF] text-white" : "text-black hover:bg-[#1E90FF] hover:text-white"}
                  `}
                  title={item.tooltip}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:overflow-y-auto lg:bg-white lg:border-r-2 lg:border-black">
        <NavigationContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-white">
          <h1 className="text-xl font-bold text-black">PropertyApp</h1>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-2 border-black hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] bg-transparent"
                title="Menu - Mở menu điều hướng"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-white border-r-2 border-black">
              <div className="flex items-center justify-between p-4 border-b-2 border-black">
                <h1 className="text-xl font-bold text-black">PropertyApp</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-2 border-black hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1">
                <nav className="p-4">
                  <ul className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`
                              flex items-center px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200
                              ${isActive ? "bg-[#1E90FF] text-white" : "text-black hover:bg-[#1E90FF] hover:text-white"}
                            `}
                            title={item.tooltip}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="mr-3 h-6 w-6" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="min-h-screen">
          <div className="p-4 lg:p-8">
            <div className="bg-white border-2 border-black rounded-lg min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-4rem)]">
              <div className="p-6 lg:p-8">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
