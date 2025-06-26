import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import FeatureCard from '../components/FeatureCard'
import AnimatedSection from '../components/AnimatedSection'
import TextChanger from '../components/TextChanger'
import GlassmorphicCard from '../components/GlassmorphicCard'
import ImageCarousel from '../components/ImageCarousel'
import TestimonialsSection from '../components/ui/TestimonialsSection'
import CTAWithRectangle from '../components/ui/cta-with-rectangle'
import GradientCardShowcase from '../components/ui/gradient-card-showcase'
import StickyScroll from '../components/ui/sticky-scroll'
import StickyGallery from '../components/ui/sticky-gallery'

export default function Home() {
  // Text changing phrases for the hero section
  const fitnessJourneyPhrases = [
    'Fitness Journey',
    'Wellness Path',
    'Strength Goals',
    'Healthy Lifestyle',
    'Fitness Transformation'
  ]

  // Text changing phrases for the about section
  const gymPhrases = [
    '3D The Gym',
    'Fitness Excellence',
    'Training Innovation',
    'Wellness Center',
    'Your Fitness Partner'
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with video background */}
      <section className="relative py-24 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {typeof window !== 'undefined' && (
            <video 
              className="absolute w-full h-full object-cover" 
              autoPlay 
              muted 
              loop 
              playsInline
              src="/MVI_7188.MOV"
            ></video>
          )}
          <div className="absolute inset-0 bg-dark/70"></div> {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-warning/10 opacity-50"></div>
        </div>
        <div className="container-custom mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up" className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 whitespace-nowrap">
              <span className="text-gradient">Transform Your</span> <span className="animate-text-fade whitespace-nowrap">{fitnessJourneyPhrases[0]}</span>
            </h1>
            <TextChanger 
              baseText="Transform Your"
              phrases={fitnessJourneyPhrases}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 hidden md:block"
            />
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mb-8">
              Experience state-of-the-art facilities, expert trainers, and a vibrant community dedicated to helping you achieve your ultimate fitness goals.
            </p>
            <Link 
              href="/membership" 
              className="btn-primary flex items-center space-x-2 hover-glow-primary text-lg px-8 py-4 rounded-full animate-bounce-slow"
            >
              <span>JOIN NOW</span>
              <FiArrowRight />
            </Link>
          </AnimatedSection>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-12 -right-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-36 right-36 w-32 h-32 bg-warning/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Premium Services Section with Gradient Cards */}
      <section className="py-20 bg-dark relative overflow-hidden">
        <div className="container-custom mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up" className="text-center">
            <h2 className="section-title text-center text-4xl md:text-5xl mb-4">Our Premium Services</h2>
            <p className="section-subtitle text-center">
              Discover our comprehensive suite of fitness and wellness services designed to transform your health journey
            </p>
          </AnimatedSection>
        </div>
        
        {/* Gradient Card Showcase */}
        <AnimatedSection animation="fade-up" delay={0.3}>
          <GradientCardShowcase />
        </AnimatedSection>
      </section>

      {/* About Section with Sticky Scroll Gallery */}
      <StickyScroll>
        <StickyGallery 
          title="3D THE GYM" 
          description="Where Fitness Meets Innovation" 
          className="py-0"
        />
      </StickyScroll>
      
      {/* Testimonials Section */}
      <TestimonialsSection 
        testimonials={[
          {
            text: "Lost 30 pounds in 6 months with personalized training. The trainers are exceptional and the facilities are top-notch!",
            image: "https://randomuser.me/api/portraits/women/1.jpg",
            name: "Briana Patton",
            role: "Operations Manager",
          },
          {
            text: "Implementing this fitness program was smooth and quick. The customizable, user-friendly interface made team training effortless.",
            image: "https://randomuser.me/api/portraits/men/2.jpg",
            name: "Bilal Ahmed",
            role: "IT Manager",
          },
          {
            text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
            image: "https://randomuser.me/api/portraits/women/3.jpg",
            name: "Saman Malik",
            role: "Customer Support Lead",
          },
          {
            text: "This gym's seamless integration enhanced our fitness operations and efficiency. Highly recommend for its intuitive interface.",
            image: "https://randomuser.me/api/portraits/men/4.jpg",
            name: "Omar Raza",
            role: "CEO",
          },
          {
            text: "Its robust features and quick support have transformed our workout routine, making us significantly more efficient.",
            image: "https://randomuser.me/api/portraits/women/5.jpg",
            name: "Zainab Hussain",
            role: "Project Manager",
          },
          {
            text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall fitness performance.",
            image: "https://randomuser.me/api/portraits/women/6.jpg",
            name: "Aliza Khan",
            role: "Business Analyst",
          },
          {
            text: "Our fitness functions improved with a user-friendly design and positive customer feedback.",
            image: "https://randomuser.me/api/portraits/men/7.jpg",
            name: "Farhan Siddiqui",
            role: "Marketing Director",
          },
          {
            text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
            image: "https://randomuser.me/api/portraits/women/8.jpg",
            name: "Sana Sheikh",
            role: "Sales Manager",
          },
          {
            text: "Using this gym, our online presence and conversions significantly improved, boosting business performance.",
            image: "https://randomuser.me/api/portraits/men/9.jpg",
            name: "Hassan Ali",
            role: "E-commerce Manager",
          },
        ]}
      />

      {/* CTA Section with enhanced animations and rectangle glow effect */}
      <AnimatedSection animation="fade-up">
        <CTAWithRectangle
          title="Ready to Transform Your Fitness Journey?"
          description="Join 3D The Gym today and experience the difference our comprehensive approach to fitness can make in your life."
          primaryButtonText="View Membership Plans"
          primaryButtonLink="/membership"
          secondaryButtonText="Explore Our Classes"
          secondaryButtonLink="/classes"
          className="py-20"
        />
      </AnimatedSection>
    </div>
  )
}