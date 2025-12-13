"use client"

import { useState } from "react"
import { Menu, X, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-xl font-bold text-black">40N4</div>
          </Link>

          {/* User Profile and Menu - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center hover:bg-black/10 transition-colors"
                aria-label="User menu"
              >
                <span className="text-sm font-semibold text-black">JD</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-lg z-50">
                  <Link
                    href="/user-profile"
                    className="block px-4 py-3 text-sm text-black hover:bg-black/5 rounded-t-lg transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-black hover:bg-black/5 rounded-b-lg transition-colors flex items-center gap-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-black/10 rounded-lg shadow-lg z-50 py-2">
                  <Link href="/vehicle-profile" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full gap-2 bg-black text-white hover:bg-black/90 justify-start">
                      <Plus size={18} />
                      Add Vehicle
                    </Button>
                  </Link>
                  <div className="border-t border-black/10 my-2" />
                  <Link
                    href="#about"
                    className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="#faqs"
                    className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQs
                  </Link>
                  <Link
                    href="#terms"
                    className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="#contact"
                    className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative" onMouseLeave={() => setShowUserMenu(false)}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center hover:bg-black/10 transition-colors"
                aria-label="User menu"
              >
                <span className="text-xs font-semibold text-black">JD</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-black/10 rounded-lg shadow-lg z-50">
                  <Link
                    href="/user-profile"
                    className="block px-3 py-2 text-xs text-black hover:bg-black/5 rounded-t-lg transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    className="w-full text-left px-3 py-2 text-xs text-black hover:bg-black/5 rounded-b-lg transition-colors flex items-center gap-1"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-black/10 py-3 space-y-2">
            <Link href="/vehicle-profile" className="block" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full gap-2 bg-black text-white hover:bg-black/90 justify-start">
                <Plus size={18} />
                Add Vehicle
              </Button>
            </Link>
            <Link
              href="#about"
              className="block px-4 py-2 text-sm text-black hover:bg-black/5 rounded-lg transition-colors"
            >
              About
            </Link>
            <Link
              href="#faqs"
              className="block px-4 py-2 text-sm text-black hover:bg-black/5 rounded-lg transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="#terms"
              className="block px-4 py-2 text-sm text-black hover:bg-black/5 rounded-lg transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="#contact"
              className="block px-4 py-2 text-sm text-black hover:bg-black/5 rounded-lg transition-colors"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
