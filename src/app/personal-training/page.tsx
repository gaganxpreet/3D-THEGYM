'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiCalendar, FiClock, FiUser, FiTag, FiPlus, FiTrash2, FiMail, FiPhone, FiStar } from 'react-icons/fi'

// Sample trainers data
const trainers = [
  {
    id: 1,
    name: 'Alex Johnson',
    image: '/trainers/trainer1.svg',
    specialty: 'Strength & Conditioning',
    experience: '8+ years',
    bio: 'Alex specializes in strength training and athletic performance. With a background in competitive sports, he helps clients achieve their strength goals safely and effectively.',
    rating: 4.9,
    reviews: 127,
    certifications: ['NASM Certified Personal Trainer', 'Strength & Conditioning Specialist', 'TRX Certified'],
    availability: 'Mon-Fri: 6am-2pm'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    image: '/trainers/trainer2.svg',
    specialty: 'Yoga & Flexibility',
    experience: '6+ years',
    bio: 'Sarah is passionate about helping clients improve flexibility, reduce stress, and build mind-body awareness through yoga and mobility training.',
    rating: 4.8,
    reviews: 93,
    certifications: ['RYT-500 Yoga Instructor', 'Corrective Exercise Specialist', 'Mobility Coach'],
    availability: 'Mon-Wed: 9am-5pm, Sat: 8am-12pm'
  },
  {
    id: 3,
    name: 'Marcus Chen',
    image: '/trainers/trainer3.svg',
    specialty: 'Weight Loss & Nutrition',
    experience: '10+ years',
    bio: 'Marcus combines effective training protocols with nutrition guidance to help clients achieve sustainable weight loss and improved health markers.',
    rating: 4.9,
    reviews: 156,
    certifications: ['ACE Certified Personal Trainer', 'Precision Nutrition Coach', 'Weight Management Specialist'],
    availability: 'Tue-Sat: 7am-3pm'
  },
  {
    id: 4,
    name: 'Jasmine Rodriguez',
    image: '/trainers/trainer4.svg',
    specialty: 'HIIT & Functional Training',
    experience: '5+ years',
    bio: 'Jasmine specializes in high-intensity interval training and functional movement patterns that translate to improved performance in daily life.',
    rating: 4.7,
    reviews: 78,
    certifications: ['NSCA Certified Personal Trainer', 'Functional Training Specialist', 'Kettlebell Instructor'],
    availability: 'Mon, Wed, Fri: 12pm-8pm'
  }
]

// Sample training packages
const trainingPackages = [
  {
    id: 1,
    title: 'Starter Package',
    sessions: 4,
    pricePerSession: 60,
    totalPrice: 240,
    features: [
      'Initial fitness assessment',
      'Personalized workout plan',
      'Form correction and technique guidance',
      'Progress tracking'
    ],
    popular: false
  },
  {
    id: 2,
    title: 'Transformation Package',
    sessions: 12,
    pricePerSession: 55,
    totalPrice: 660,
    features: [
      'Comprehensive fitness assessment',
      'Customized workout program',
      'Nutrition guidance',
      'Bi-weekly progress assessments',
      'Email support between sessions',
      'One free session if goals are met'
    ],
    popular: true
  },
  {
    id: 3,
    title: 'Elite Package',
    sessions: 24,
    pricePerSession: 50,
    totalPrice: 1200,
    features: [
      'Advanced fitness assessment',
      'Fully customized training program',
      'Detailed nutrition planning',
      'Weekly progress tracking',
      'Unlimited messaging support',
      'Two free sessions upon completion',
      'Priority scheduling'
    ],
    popular: false
  }
]

export default function PersonalTrainingPage() {
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)

  // Function to handle booking with a trainer
  const handleBookTrainer = (trainerId: number) => {
    setSelectedTrainer(trainerId)
    setShowBookingForm(true)
  }

  // Function to handle selecting a package
  const handleSelectPackage = (packageId: number) => {
    setSelectedPackage(packageId)
    setShowBookingForm(true)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-warning/20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Personal Training</h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Work one-on-one with our expert trainers to achieve your fitness goals faster and more effectively with personalized guidance.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-dark">
        <div className="container-custom mx-auto px-4">
          <h2 className="section-title text-center mb-12">Why Choose Personal Training?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover-lift text-center p-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Approach</h3>
              <p className="text-text-secondary">
                Get a workout plan tailored specifically to your body, goals, and preferences for optimal results.
              </p>
            </div>
            
            <div className="card hover-lift text-center p-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Guidance</h3>
              <p className="text-text-secondary">
                Learn proper form and technique from certified professionals to maximize effectiveness and prevent injuries.
              </p>
            </div>
            
            <div className="card hover-lift text-center p-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Accountability</h3>
              <p className="text-text-secondary">
                Stay motivated and consistent with scheduled sessions and a trainer who keeps you accountable to your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Trainers Section */}
      <section className="py-16 bg-card">
        <div className="container-custom mx-auto px-4">
          <h2 className="section-title text-center mb-12">Meet Our Expert Trainers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="card hover-lift overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      {/* In a real app, replace with actual images */}
                      <FiUser className="text-6xl text-white" />
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{trainer.name}</h3>
                      <div className="flex items-center">
                        <FiStar className="text-yellow-500 mr-1" />
                        <span className="font-medium">{trainer.rating}</span>
                        <span className="text-text-secondary text-sm ml-1">({trainer.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/20 text-primary">
                        {trainer.specialty}
                      </span>
                      <span className="inline-block px-3 py-1 text-sm rounded-full bg-dark ml-2">
                        {trainer.experience}
                      </span>
                    </div>
                    
                    <p className="text-text-secondary mb-4">{trainer.bio}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-bold mb-1">Certifications:</h4>
                      <ul className="text-text-secondary text-sm">
                        {trainer.certifications.map((cert, index) => (
                          <li key={index} className="mb-1">• {cert}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center text-sm text-text-secondary mb-4">
                      <FiClock className="mr-1" />
                      <span>{trainer.availability}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleBookTrainer(trainer.id)}
                      className="btn-primary w-full"
                    >
                      Book a Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Packages Section */}
      <section className="py-16 bg-dark">
        <div className="container-custom mx-auto px-4">
          <h2 className="section-title text-center mb-12">Training Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`card hover-lift relative ${pkg.popular ? 'border-2 border-primary' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-bold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">${pkg.totalPrice}</span>
                      <span className="text-text-secondary ml-2">for {pkg.sessions} sessions</span>
                    </div>
                    <p className="text-text-secondary text-sm">(${pkg.pricePerSession}/session)</p>
                  </div>
                  
                  <ul className="mb-6 space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ease-in-out ${pkg.popular ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-dark hover:bg-dark/90 text-white border border-gray-700'}`}
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-text-secondary mb-4">
              Not sure which package is right for you? Schedule a free consultation with one of our trainers.
            </p>
            <button 
              onClick={() => setShowBookingForm(true)}
              className="btn-secondary"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {selectedTrainer ? 'Book a Session with Trainer' : selectedPackage ? 'Select Your Package' : 'Book a Free Consultation'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  placeholder="Your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  placeholder="Your phone number"
                />
              </div>
              
              {selectedTrainer && (
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  />
                </div>
              )}
              
              {selectedTrainer && (
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <input 
                    type="time" 
                    className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Your Fitness Goals</label>
                <textarea 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none h-24"
                  placeholder="Tell us about your fitness goals and any specific areas you want to focus on"
                ></textarea>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  onClick={() => {
                    alert('Booking submitted! Our team will contact you shortly. (Demo only)')
                    setShowBookingForm(false)
                  }}
                >
                  Submit
                </button>
                <button 
                  type="button" 
                  className="bg-dark hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out flex-1"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}