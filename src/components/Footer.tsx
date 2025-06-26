import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-dark/90 border-t border-white/10 py-12">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">3D The Gym</span>
            </Link>
            <p className="text-text-secondary text-sm">
              Experience state-of-the-art facilities, expert trainers, and a vibrant community dedicated to helping you achieve your ultimate fitness goals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/classes" className="text-text-secondary hover:text-primary transition-colors">
                  Classes
                </Link>
              </li>
              <li>
                <Link href="/personal-training" className="text-text-secondary hover:text-primary transition-colors">
                  Personal Training
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-text-secondary hover:text-primary transition-colors">
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-bold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/workout-ai" className="text-text-secondary hover:text-primary transition-colors">
                  Workout AI
                </Link>
              </li>
              <li>
                <Link href="/calorie-counter" className="text-text-secondary hover:text-primary transition-colors">
                  Calorie Counter
                </Link>
              </li>
              <li>
                <Link href="/fitness-assessment" className="text-text-secondary hover:text-primary transition-colors">
                  Fitness Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>123 Fitness Street</li>
              <li>Workout City, WC 12345</li>
              <li>info@3dthegym.com</li>
              <li>(123) 456-7890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-text-secondary text-sm">
          <p>&copy; {new Date().getFullYear()} 3D The Gym. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}