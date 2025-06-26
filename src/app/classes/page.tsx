'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiCalendar, FiClock, FiUser, FiTag, FiPlus, FiTrash2 } from 'react-icons/fi'

// Sample class data
const initialClasses = [
  {
    id: 1,
    title: 'Sunrise Yoga',
    time: '7:00 AM - 8:00 AM',
    instructor: 'Anna K.',
    category: 'Yoga',
    description: 'Start your day with energizing yoga flows and mindful meditation.'
  },
  {
    id: 2,
    title: 'CrossFit Burn',
    time: '9:00 AM - 10:00 AM',
    instructor: 'Mike R.',
    category: 'CrossFit',
    description: 'High-intensity interval training to push your limits and build strength.'
  },
  {
    id: 3,
    title: 'Cardio Blast',
    time: '12:00 PM - 1:00 PM',
    instructor: 'Sarah P.',
    category: 'Cardio',
    description: 'A fun and challenging cardio workout to boost your endurance.'
  },
  {
    id: 4,
    title: 'Strength Foundation',
    time: '5:00 PM - 6:00 PM',
    instructor: 'John B.',
    category: 'Strength',
    description: 'Focus on fundamental strength exercises and proper form.'
  },
  {
    id: 5,
    title: 'Evening Flow Yoga',
    time: '7:00 PM - 8:00 PM',
    instructor: 'Laura M.',
    category: 'Yoga',
    description: 'Unwind and relax with a gentle yoga session.'
  },
  {
    id: 6,
    title: 'Total Body CrossFit',
    time: '6:00 AM - 7:00 AM',
    instructor: 'Chris G.',
    category: 'CrossFit',
    description: 'A comprehensive CrossFit workout targeting all major muscle groups.'
  }
]

// Sample challenge data
const initialChallenges = [
  {
    id: 1,
    title: 'Weekly CrossFit WOD Challenge',
    status: 'Ends in 7 days',
    statusType: 'green',
    description: 'Tackle 3 signature CrossFit WODs this week. Post your times!',
    category: 'CrossFit',
    goal: 'Complete 3 WODs (Completion)',
    frequency: 'Weekly',
    dates: 'Jun 7, 2025 - Jun 14, 2025',
    tags: ['CrossFit', 'HIIT', 'Strength', 'Endurance']
  },
  {
    id: 2,
    title: '5-Day Morning Yoga Flow',
    status: 'Starts in 2 days',
    statusType: 'blue',
    description: 'Start your day with a 20-minute yoga flow for 5 consecutive days to improve flexibility and mindfulness.',
    category: 'Yoga',
    goal: '5 Sessions of 20min Yoga (Completion)',
    frequency: 'Daily',
    dates: 'Jun 9, 2025 - Jun 14, 2025',
    tags: ['Yoga', 'Mindfulness', 'Flexibility', 'Morning Routine']
  },
  {
    id: 3,
    title: 'Strength Focus: Max Deadlift Week',
    status: 'Ends in 7 days',
    statusType: 'green',
    description: 'Attempt a new 1-rep max deadlift this week. Focus on form and safety!',
    category: 'Strength',
    goal: 'New 1-Rep Max Deadlift (Repetition)',
    frequency: 'One-Time',
    dates: 'Jun 7, 2025 - Jun 14, 2025',
    tags: ['Strength', 'Deadlift', 'Powerlifting']
  }
]

// Mock user state (in a real app, this would come from authentication)
const isHost = true

export default function ClassesPage() {
  const [classes, setClasses] = useState(initialClasses)
  const [challenges, setChallenges] = useState(initialChallenges)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)

  // Function to handle booking a class
  const handleBookClass = (classId: number) => {
    setSelectedClass(classId)
    setShowBookingForm(true)
  }

  // Function to handle deleting a class (host only)
  const handleDeleteClass = (classId: number) => {
    if (isHost) {
      setClasses(classes.filter(c => c.id !== classId))
    }
  }

  // Function to handle deleting a challenge (host only)
  const handleDeleteChallenge = (challengeId: number) => {
    if (isHost) {
      setChallenges(challenges.filter(c => c.id !== challengeId))
    }
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'yoga':
        return 'bg-blue-500'
      case 'crossfit':
        return 'bg-red-500'
      case 'cardio':
        return 'bg-green-500'
      case 'strength':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Get status badge color
  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'green':
        return 'bg-green-500'
      case 'blue':
        return 'bg-blue-500'
      case 'red':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-warning/20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Classes & Challenges</h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Join our expert-led classes and participate in motivating fitness challenges to push your limits and achieve your goals.
          </p>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-16 bg-dark">
        <div className="container-custom mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Class Schedule</h2>
            {isHost && (
              <button className="btn-primary flex items-center space-x-2">
                <FiPlus />
                <span>Add Class</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div key={classItem.id} className="card hover-lift">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
                  {isHost && (
                    <button 
                      onClick={() => handleDeleteClass(classItem.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete class"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <div className="flex items-center mb-2">
                  <FiClock className="mr-2 text-text-secondary" />
                  <span className="text-text-secondary text-sm">{classItem.time}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FiUser className="mr-2 text-text-secondary" />
                  <span className="text-text-secondary text-sm">{classItem.instructor}</span>
                </div>
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${getCategoryColor(classItem.category)}`}>
                    {classItem.category}
                  </span>
                </div>
                <p className="text-text-secondary mb-6">{classItem.description}</p>
                <button 
                  onClick={() => handleBookClass(classItem.id)}
                  className="btn-primary w-full"
                >
                  Book Class (Demo)
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 bg-card">
        <div className="container-custom mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Fitness Challenges</h2>
            {isHost && (
              <button className="btn-primary flex items-center space-x-2">
                <FiPlus />
                <span>Add Challenge</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="card hover-lift">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                  {isHost && (
                    <button 
                      onClick={() => handleDeleteChallenge(challenge.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete challenge"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${getStatusColor(challenge.statusType)}`}>
                    {challenge.status}
                  </span>
                </div>
                <p className="text-text-secondary mb-4">{challenge.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-bold mb-1">Category</h4>
                    <p className="text-text-secondary text-sm">{challenge.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Goal</h4>
                    <p className="text-text-secondary text-sm">{challenge.goal}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Frequency</h4>
                    <p className="text-text-secondary text-sm">{challenge.frequency}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Dates</h4>
                    <p className="text-text-secondary text-sm">{challenge.dates}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2 py-1 text-xs rounded-full bg-dark text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Book a Class</h3>
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
                <label className="block text-sm font-medium mb-1">Age</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  placeholder="Your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Time</label>
                <input 
                  type="time" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  onClick={() => {
                    alert('Booking submitted! (Demo only)')
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