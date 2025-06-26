import Link from 'next/link'
import { FiActivity, FiAward, FiCpu, FiArrowRight } from 'react-icons/fi'

type FeatureCardProps = {
  icon: 'ai' | 'nutrition' | 'assessment'
  title: string
  description: string
  ctaText: string
  ctaLink: string
  glowColor: 'blue' | 'green' | 'purple'
}

export default function FeatureCard({
  icon,
  title,
  description,
  ctaText,
  ctaLink,
  glowColor
}: FeatureCardProps) {
  // Determine icon component with premium styling
  const IconComponent = () => {
    switch (icon) {
      case 'ai':
        return (
          <div className="p-4 rounded-full bg-secondary/10 inline-block">
            <FiCpu className="w-12 h-12 text-secondary" />
          </div>
        )
      case 'nutrition':
        return (
          <div className="p-4 rounded-full bg-success/10 inline-block">
            <FiActivity className="w-12 h-12 text-success" />
          </div>
        )
      case 'assessment':
        return (
          <div className="p-4 rounded-full bg-warning/10 inline-block">
            <FiAward className="w-12 h-12 text-warning" />
          </div>
        )
      default:
        return (
          <div className="p-4 rounded-full bg-primary/10 inline-block">
            <FiActivity className="w-12 h-12 text-primary" />
          </div>
        )
    }
  }

  // Premium card styling
  const getCardClass = () => {
    switch (glowColor) {
      case 'blue':
        return 'border-secondary/20'
      case 'green':
        return 'border-success/20'
      case 'purple':
        return 'border-warning/20'
      default:
        return 'border-primary/20'
    }
  }

  return (
    <div className={`card hover-lift ${getCardClass()} min-h-[320px] flex flex-col justify-between bg-card/90 border-2 shadow-xl`}>
      <div>
        <div className="mb-6">
          <IconComponent />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-text-secondary mb-6 font-light">{description}</p>
      </div>
      <Link 
        href={ctaLink}
        className="text-primary font-medium flex items-center group transition-all duration-300 mt-2 hover:text-primary/80"
      >
        <span className="group-hover:mr-2 transition-all duration-300 border-b border-primary/30 pb-1">{ctaText}</span>
        <FiArrowRight className="transform group-hover:translate-x-1 transition-all duration-300" />
      </Link>
    </div>
  )
}