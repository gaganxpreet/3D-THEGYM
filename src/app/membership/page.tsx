'use client'

import { useState } from 'react'
import { FiCheck, FiX, FiHelpCircle } from 'react-icons/fi'

// Sample membership plans
const membershipPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 29.99,
    period: 'month',
    description: 'Perfect for beginners looking to start their fitness journey',
    features: [
      { text: 'Access to gym facilities', included: true },
      { text: 'Basic fitness assessment', included: true },
      { text: 'Access to group classes', included: false },
      { text: 'Personal training sessions', included: false },
      { text: 'Nutrition consultation', included: false },
      { text: 'Access to premium equipment', included: false },
      { text: 'Workout AI recommendations', included: false },
    ],
    popular: false,
    color: 'from-blue-500/20 to-blue-700/20',
    buttonClass: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
  },
  {
    id: 2,
    name: 'Premium',
    price: 59.99,
    period: 'month',
    description: 'Our most popular plan for fitness enthusiasts',
    features: [
      { text: 'Access to gym facilities', included: true },
      { text: 'Comprehensive fitness assessment', included: true },
      { text: 'Access to group classes', included: true },
      { text: '2 Personal training sessions/month', included: true },
      { text: 'Basic nutrition consultation', included: true },
      { text: 'Access to premium equipment', included: false },
      { text: 'Workout AI recommendations', included: false },
    ],
    popular: true,
    color: 'from-primary/20 to-primary/40',
    buttonClass: 'bg-primary text-white hover:bg-primary/90'
  },
  {
    id: 3,
    name: 'Elite',
    price: 99.99,
    period: 'month',
    description: 'The ultimate fitness experience with all premium features',
    features: [
      { text: 'Access to gym facilities', included: true },
      { text: 'Advanced fitness assessment', included: true },
      { text: 'Unlimited access to group classes', included: true },
      { text: '4 Personal training sessions/month', included: true },
      { text: 'Advanced nutrition consultation', included: true },
      { text: 'Access to premium equipment', included: true },
      { text: 'Workout AI recommendations', included: true },
    ],
    popular: false,
    color: 'from-yellow-500/20 to-yellow-700/20',
    buttonClass: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white'
  }
]

// Sample FAQs
const faqs = [
  {
    question: 'Is there a joining fee?',
    answer: 'No, we do not charge any joining fees. The price you see is the price you pay, with no hidden costs.'
  },
  {
    question: 'Can I freeze my membership?',
    answer: 'Yes, you can freeze your membership for up to 3 months per year. A small admin fee may apply.'
  },
  {
    question: 'What is the minimum contract period?',
    answer: 'Our standard memberships have a 3-month minimum commitment. We also offer month-to-month options at a slightly higher rate.'
  },
  {
    question: 'How do I cancel my membership?',
    answer: 'You can cancel your membership by giving 30 days notice. Please contact our membership team or visit the reception desk.'
  },
  {
    question: 'Are there any discounts for students or seniors?',
    answer: 'Yes, we offer special rates for students, seniors, and military personnel. Please bring valid ID to claim these discounts.'
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Absolutely! We offer a free 1-day pass for new members. Contact us to arrange your visit.'
  }
]

export default function MembershipPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Function to handle plan selection
  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId)
    setShowSignupForm(true)
  }

  // Function to toggle FAQ expansion
  const toggleFaq = (faqIndex: number) => {
    if (expandedFaq === faqIndex) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(faqIndex)
    }
  }

  // Calculate annual price (20% discount)
  const getPrice = (basePrice: number) => {
    if (billingPeriod === 'annual') {
      return (basePrice * 12 * 0.8).toFixed(2)
    }
    return basePrice.toFixed(2)
  }

  // Get billing period display text
  const getPeriodText = () => {
    return billingPeriod === 'annual' ? 'year' : 'month'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-warning/20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Membership Plans</h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Choose the perfect membership plan that fits your fitness goals and budget. Join our community today!
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-dark">
        <div className="container-custom mx-auto px-4">
          <div className="flex justify-center mb-12">
            <div className="bg-card p-1 rounded-lg flex">
              <button 
                className={`px-6 py-2 rounded-md transition-all ${billingPeriod === 'monthly' ? 'bg-primary text-white' : 'text-text-secondary'}`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-md transition-all ${billingPeriod === 'annual' ? 'bg-primary text-white' : 'text-text-secondary'}`}
                onClick={() => setBillingPeriod('annual')}
              >
                Annual <span className="text-xs font-bold text-success">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`card hover-lift relative overflow-hidden ${plan.popular ? 'border-2 border-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-bold">
                    Most Popular
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-30`}></div>
                
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-text-secondary mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold">${getPrice(plan.price)}</span>
                      <span className="text-text-secondary ml-2">/{getPeriodText()}</span>
                    </div>
                    {billingPeriod === 'annual' && (
                      <p className="text-success text-sm">Save ${(plan.price * 12 * 0.2).toFixed(2)} per year</p>
                    )}
                  </div>
                  
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.included ? (
                          <FiCheck className="text-success mr-2" />
                        ) : (
                          <FiX className="text-red-500 mr-2" />
                        )}
                        <span className={feature.included ? '' : 'text-text-secondary'}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ease-in-out ${plan.buttonClass}`}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card">
        <div className="container-custom mx-auto px-4">
          <h2 className="section-title text-center mb-12">Membership Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">State-of-the-Art Equipment</h3>
              <p className="text-text-secondary">
                Access to premium fitness equipment and dedicated workout spaces.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Trainers</h3>
              <p className="text-text-secondary">
                Learn from certified fitness professionals who are passionate about your success.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fitness Assessment</h3>
              <p className="text-text-secondary">
                Regular evaluations to track your progress and adjust your fitness plan.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Options</h3>
              <p className="text-text-secondary">
                Choose from various membership plans to fit your schedule and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-dark">
        <div className="container-custom mx-auto px-4">
          <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 bg-card rounded-lg flex justify-between items-center hover:bg-card/80 transition-colors"
                >
                  <span className="font-bold">{faq.question}</span>
                  <FiHelpCircle className={`transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="p-4 bg-dark border border-gray-700 rounded-b-lg mt-1">
                    <p className="text-text-secondary">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Sign Up for {membershipPlans.find(p => p.id === selectedPlan)?.name} Membership
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                    placeholder="Last name"
                  />
                </div>
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
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  placeholder="Your address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded bg-dark border border-gray-700 focus:border-primary outline-none"
                  placeholder="Name and phone number"
                />
              </div>
              
              <div className="flex items-start mt-4">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 mr-2"
                />
                <label htmlFor="terms" className="text-sm text-text-secondary">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  onClick={() => {
                    alert('Membership sign-up successful! (Demo only)')
                    setShowSignupForm(false)
                  }}
                >
                  Complete Sign Up
                </button>
                <button 
                  type="button" 
                  className="bg-dark hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out flex-1"
                  onClick={() => setShowSignupForm(false)}
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