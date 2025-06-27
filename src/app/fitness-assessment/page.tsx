'use client'

import { useState } from 'react'
import { FiActivity, FiAlertCircle, FiCheckCircle, FiHeart, FiInfo } from 'react-icons/fi'

export default function FitnessAssessment() {
  // Form state
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    neck: '',
    waist: '',
    fitnessGoals: {
      weightLoss: false,
      muscleGain: false,
      endurance: false,
      strength: false,
      flexibility: false,
      generalHealth: false
    },
    activityLevel: ''
  })

  // Results state
  type Results = {
    bmi: number;
    bodyFat: number;
    bmr: number;
    tdee: number;
    healthCategory: string;
    calorieRecommendations: {
      weightLoss: {
        conservative: number;
        moderate: number;
        aggressive: number;
      };
      muscleGain: {
        lean: number;
        moderate: number;
        aggressive: number;
      };
      maintenance: number;
    };
    waterIntake: number;
    proteinNeeds: {
      min: number;
      max: number;
    };
    macroRatios: {
      weightLoss: { protein: string; carbs: string; fats: string; };
      muscleGain: { protein: string; carbs: string; fats: string; };
      maintenance: { protein: string; carbs: string; fats: string; };
      endurance: { protein: string; carbs: string; fats: string; };
    };
    recommendations: string[];
  };
  
  const [results, setResults] = useState<Results>({
    bmi: 0,
    bodyFat: 0,
    bmr: 0,
    tdee: 0,
    healthCategory: '',
    calorieRecommendations: {
      weightLoss: {
        conservative: 0,
        moderate: 0,
        aggressive: 0
      },
      muscleGain: {
        lean: 0,
        moderate: 0,
        aggressive: 0
      },
      maintenance: 0
    },
    waterIntake: 0,
    proteinNeeds: {
      min: 0,
      max: 0
    },
    macroRatios: {
      weightLoss: { protein: '25-35%', carbs: '30-40%', fats: '25-35%' },
      muscleGain: { protein: '20-30%', carbs: '40-50%', fats: '20-30%' },
      maintenance: { protein: '15-25%', carbs: '45-55%', fats: '25-35%' },
      endurance: { protein: '15-20%', carbs: '55-65%', fats: '20-25%' }
    },
    recommendations: [] as string[]
  })

  // Show results state
  const [showResults, setShowResults] = useState(false)

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle checkbox changes
  const handleCheckboxChange = (category: 'fitnessGoals', name: string) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [name]: !formData[category][name as keyof typeof formData[typeof category]]
      }
    })
  }

  // Handle select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Calculate BMI
  const calculateBMI = (weight: number, height: number): number => {
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
  }

  // Calculate body fat percentage using BMI method
  const calculateBodyFat = (bmi: number, age: number, gender: string): number => {
    // Body fat percentage based on BMI, age, and gender
    if (gender === 'male') {
      return (1.20 * bmi) + (0.23 * age) - 16.2
    } else {
      return (1.20 * bmi) + (0.23 * age) - 5.4
    }
  }

  // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
  const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  // Calculate TDEE based on BMR and activity level
  const calculateTDEE = (bmr: number, activityLevel: string): number => {
    // Activity factors as specified
    const activityFactors: Record<string, number> = {
      'sedentary': 1.2,            // Desk job, no exercise
      'lightlyActive': 1.375,       // Light exercise 1-3 days/week
      'moderatelyActive': 1.55,     // Moderate exercise 3-5 days/week
      'veryActive': 1.725,          // Hard exercise 6-7 days/week
      'extremelyActive': 1.9        // Physical job + exercise
    }
    
    return Math.round(bmr * activityFactors[activityLevel])
  }
  
  // Calculate calorie recommendations based on TDEE and goals
  const calculateCalorieRecommendations = (tdee: number, gender: string) => {
    // Minimum thresholds
    const minCalories = gender === 'male' ? 1500 : 1200
    
    // Weight loss recommendations (caloric deficit)
    const weightLoss = {
      conservative: Math.max(minCalories, Math.round(tdee - 300)),  // 0.5 lb/week
      moderate: Math.max(minCalories, Math.round(tdee - 500)),       // 1 lb/week
      aggressive: Math.max(minCalories, Math.round(tdee - 750))      // 1.5 lb/week
    }
    
    // Muscle gain recommendations (caloric surplus)
    const muscleGain = {
      lean: Math.round(tdee + 200),         // Minimal fat gain
      moderate: Math.round(tdee + 400),     // Balanced muscle/fat gain
      aggressive: Math.round(tdee + 600)    // Faster muscle gain, more fat
    }
    
    // Maintenance
    const maintenance = tdee
    
    return { weightLoss, muscleGain, maintenance }
  }
  
  // Calculate protein needs based on weight, activity level, and goal
  const calculateProteinNeeds = (weight: number, activityLevel: string, goals: typeof formData.fitnessGoals) => {
    // Convert kg to pounds for calculation
    const weightInKg = weight
    
    let proteinFactor = { min: 0, max: 0 }
    
    // Determine protein factor based on activity and goals
    if (goals.weightLoss) {
      proteinFactor = { min: 1.8, max: 2.4 }  // Higher protein preserves muscle during weight loss
    } else if (goals.muscleGain) {
      proteinFactor = { min: 1.6, max: 2.2 }  // For muscle building
    } else if (activityLevel === 'veryActive' || activityLevel === 'extremelyActive') {
      proteinFactor = { min: 2.0, max: 2.5 }  // For athletes/intense training
    } else if (activityLevel === 'moderatelyActive') {
      proteinFactor = { min: 1.2, max: 1.6 }  // Active/general fitness
    } else {
      proteinFactor = { min: 0.8, max: 1.0 }  // Sedentary
    }
    
    return {
      min: Math.round(weightInKg * proteinFactor.min),
      max: Math.round(weightInKg * proteinFactor.max)
    }
  }
  
  // Calculate daily water intake recommendation
  const calculateWaterIntake = (weight: number, activityLevel: string): number => {
    // Base calculation: 30-35ml per kg of body weight
    let waterFactor = 30 // ml per kg
    
    // Adjust based on activity level
    if (activityLevel === 'moderatelyActive') {
      waterFactor = 35
    } else if (activityLevel === 'veryActive') {
      waterFactor = 40
    } else if (activityLevel === 'extremelyActive') {
      waterFactor = 45
    }
    
    // Calculate in ml, then convert to liters
    const waterInMl = weight * waterFactor
    return parseFloat((waterInMl / 1000).toFixed(1))
  }

  // Get health category based on BMI
  const getHealthCategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight'
    if (bmi >= 18.5 && bmi < 25) return 'Healthy'
    if (bmi >= 25 && bmi < 30) return 'Overweight'
    if (bmi >= 30 && bmi < 35) return 'Obese'
    return 'Extremely Obese'
  }

  // Generate recommendations based on assessment
  const generateRecommendations = (data: typeof formData, bmi: number, bodyFat: number): string[] => {
    const recommendations: string[] = []
    
    // BMI-based recommendations
    if (bmi < 18.5) {
      recommendations.push('Focus on increasing caloric intake with nutrient-dense foods')
      recommendations.push('Incorporate strength training to build muscle mass')
    } else if (bmi >= 25) {
      recommendations.push('Aim for a caloric deficit through balanced nutrition and regular exercise')
      recommendations.push('Include both cardio and strength training in your routine')
    }
    
    // Activity level recommendations
    if (data.activityLevel === 'sedentary' || data.activityLevel === 'lightlyActive') {
      recommendations.push('Increase daily physical activity, aiming for at least 150 minutes of moderate exercise per week')
      recommendations.push('Start with walking and gradually incorporate more intense activities')
    }
    
    // Goal-specific recommendations
    if (data.fitnessGoals.weightLoss) {
      recommendations.push('Create a sustainable caloric deficit of 500-750 calories per day')
      recommendations.push('Focus on high-protein foods to preserve muscle mass during weight loss')
    }
    
    if (data.fitnessGoals.muscleGain) {
      recommendations.push('Ensure adequate protein intake (1.6-2.2g per kg of body weight)')
      recommendations.push('Prioritize progressive overload in your strength training program')
    }
    
    if (data.fitnessGoals.endurance) {
      recommendations.push('Gradually increase cardio duration and intensity over time')
      recommendations.push('Include interval training to improve cardiovascular capacity')
    }
    
    // General recommendations
    recommendations.push('Stay hydrated by drinking at least 8 glasses of water daily')
    recommendations.push('Ensure 7-9 hours of quality sleep for optimal recovery and results')
    
    return recommendations
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert string values to numbers
    const age = parseInt(formData.age)
    const height = parseInt(formData.height)
    const weight = parseInt(formData.weight)
    
    // Calculate metrics
    const bmi = calculateBMI(weight, height)
    const bodyFat = calculateBodyFat(bmi, age, formData.gender)
    const bmr = calculateBMR(weight, height, age, formData.gender)
    const tdee = calculateTDEE(bmr, formData.activityLevel)
    const calorieRecommendations = calculateCalorieRecommendations(tdee, formData.gender)
    const proteinNeeds = calculateProteinNeeds(weight, formData.activityLevel, formData.fitnessGoals)
    const waterIntake = calculateWaterIntake(weight, formData.activityLevel)
    const healthCategory = getHealthCategory(bmi)
    const recommendations = generateRecommendations(formData, bmi, bodyFat)
    
    // Set results
    setResults({
      bmi: parseFloat(bmi.toFixed(1)),
      bodyFat: parseFloat(bodyFat.toFixed(1)),
      bmr: Math.round(bmr),
      tdee: tdee,
      healthCategory,
      calorieRecommendations,
      waterIntake,
      proteinNeeds,
      macroRatios: {
        weightLoss: { protein: '25-35%', carbs: '30-40%', fats: '25-35%' },
        muscleGain: { protein: '20-30%', carbs: '40-50%', fats: '20-30%' },
        maintenance: { protein: '15-25%', carbs: '45-55%', fats: '25-35%' },
        endurance: { protein: '15-20%', carbs: '55-65%', fats: '20-25%' }
      },
      recommendations
    })
    
    // Show results
    setShowResults(true)
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden aurora-bg">
        <div className="container-custom mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-warning">Comprehensive</span> Fitness Assessment
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mb-8">
              Get detailed health analysis and personalized recommendations to optimize your fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Assessment Form */}
      <section className="py-16 bg-dark">
        <div className="container-custom mx-auto px-4">
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Complete Your Assessment</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Metrics */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiInfo className="mr-2 text-warning" />
                  Basic Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium mb-2">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-white/20 rounded-lg p-3 focus:border-warning focus:ring-1 focus:ring-warning"
                      required
                      min="18"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleSelectChange}
                      className="w-full bg-dark border border-white/20 rounded-lg p-3 focus:border-warning focus:ring-1 focus:ring-warning"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-white/20 rounded-lg p-3 focus:border-warning focus:ring-1 focus:ring-warning"
                      required
                      min="100"
                      max="250"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-white/20 rounded-lg p-3 focus:border-warning focus:ring-1 focus:ring-warning"
                      required
                      min="30"
                      max="300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="neck" className="block text-sm font-medium mb-2">
                      Neck Circumference (cm)
                    </label>
                    <input
                      type="number"
                      id="neck"
                      name="neck"
                      value={formData.neck}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-white/20 rounded-lg p-3 focus:border-warning focus:ring-1 focus:ring-warning"
                      min="20"
                      max="80"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="waist" className="block text-sm font-medium mb-2">
                      Waist Circumference (cm)
                    </label>
                    <input
                      type="number"
                      id="waist"
                      name="waist"
                      value={formData.waist}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-white/20 rounded-lg p-3 focus:border-warning focus:ring-1 focus:ring-warning"
                      min="40"
                      max="200"
                    />
                  </div>
                </div>
              </div>
              
              {/* Fitness Goals */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiActivity className="mr-2 text-warning" />
                  Fitness Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="weightLoss"
                      checked={formData.fitnessGoals.weightLoss}
                      onChange={() => handleCheckboxChange('fitnessGoals', 'weightLoss')}
                      className="w-5 h-5 accent-warning"
                    />
                    <label htmlFor="weightLoss" className="text-sm">
                      Weight Loss
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="muscleGain"
                      checked={formData.fitnessGoals.muscleGain}
                      onChange={() => handleCheckboxChange('fitnessGoals', 'muscleGain')}
                      className="w-5 h-5 accent-warning"
                    />
                    <label htmlFor="muscleGain" className="text-sm">
                      Muscle Gain
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="endurance"
                      checked={formData.fitnessGoals.endurance}
                      onChange={() => handleCheckboxChange('fitnessGoals', 'endurance')}
                      className="w-5 h-5 accent-warning"
                    />
                    <label htmlFor="endurance" className="text-sm">
                      Endurance
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="strength"
                      checked={formData.fitnessGoals.strength}
                      onChange={() => handleCheckboxChange('fitnessGoals', 'strength')}
                      className="w-5 h-5 accent-warning"
                    />
                    <label htmlFor="strength" className="text-sm">
                      Strength
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="flexibility"
                      checked={formData.fitnessGoals.flexibility}
                      onChange={() => handleCheckboxChange('fitnessGoals', 'flexibility')}
                      className="w-5 h-5 accent-warning"
                    />
                    <label htmlFor="flexibility" className="text-sm">
                      Flexibility
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="generalHealth"
                      checked={formData.fitnessGoals.generalHealth}
                      onChange={() => handleCheckboxChange('fitnessGoals', 'generalHealth')}
                      className="w-5 h-5 accent-warning"
                    />
                    <label htmlFor="generalHealth" className="text-sm">
                      General Health
                    </label>
                  </div>
                </div>
              </div>
              

              
              {/* Activity Level */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiActivity className="mr-2 text-warning" />
                  Current Activity Level
                </h3>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleSelectChange}
                  className="w-full bg-dark border border-white/20 rounded-lg p-3 focus:border-warning focus:ring-1 focus:ring-warning"
                  required
                >
                  <option value="">Select Activity Level</option>
                  <option value="sedentary">Sedentary (office job, no exercise)</option>
                  <option value="lightlyActive">Lightly Active (light exercise 1-3 days/week)</option>
                  <option value="moderatelyActive">Moderately Active (moderate exercise 3-5 days/week)</option>
                  <option value="veryActive">Very Active (hard exercise 6-7 days/week)</option>
                  <option value="extremelyActive">Extremely Active (very hard exercise, physical job)</option>
                </select>
              </div>
              
              <div className="mt-8">
                <button type="submit" className="btn-primary bg-warning hover:bg-opacity-90 w-full py-4">
                  Calculate Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section id="results" className="py-16 bg-gradient-to-b from-dark to-card">
          <div className="container-custom mx-auto px-4">
            <h2 className="section-title text-center mb-12">Your Assessment Results</h2>
            
            {/* Health Metrics Card */}
            <div className="card mb-8 border border-warning/30 hover-glow-warning">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <FiInfo className="mr-2 text-warning" />
                Health Metrics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* BMI */}
                <div className="bg-dark/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">BMI</h4>
                    <span className={`text-sm px-2 py-1 rounded ${results.bmi < 18.5 ? 'bg-blue-500/20 text-blue-300' : results.bmi < 25 ? 'bg-green-500/20 text-green-300' : results.bmi < 30 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                      {results.healthCategory}
                    </span>
                  </div>
                  <div className="text-3xl font-bold font-roboto mb-2">{results.bmi}</div>
                  <div className="w-full bg-dark/50 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${results.bmi < 18.5 ? 'bg-blue-500' : results.bmi < 25 ? 'bg-green-500' : results.bmi < 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (results.bmi / 40) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-text-secondary flex justify-between">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
                
                {/* Body Fat */}
                <div className="bg-dark/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Body Fat</h4>
                    <span className="text-sm px-2 py-1 rounded bg-warning/20 text-warning">
                      {formData.gender === 'male' ? 
                        (results.bodyFat < 6 ? 'Essential' : 
                         results.bodyFat < 14 ? 'Athletic' : 
                         results.bodyFat < 18 ? 'Fitness' : 
                         results.bodyFat < 25 ? 'Average' : 'Obese') : 
                        (results.bodyFat < 13 ? 'Essential' : 
                         results.bodyFat < 21 ? 'Athletic' : 
                         results.bodyFat < 25 ? 'Fitness' : 
                         results.bodyFat < 32 ? 'Average' : 'Obese')}
                    </span>
                  </div>
                  <div className="text-3xl font-bold font-roboto mb-2">{results.bodyFat}%</div>
                  <div className="w-full bg-dark/50 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 rounded-full bg-warning"
                      style={{ width: `${Math.min(100, (results.bodyFat / (formData.gender === 'male' ? 35 : 45)) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-text-secondary">
                    {formData.gender === 'male' ? 
                      'Healthy range: 6-17% for men' : 
                      'Healthy range: 14-24% for women'}
                  </div>
                </div>
                
                {/* BMR */}
                <div className="bg-dark/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Basal Metabolic Rate</h4>
                  <div className="text-3xl font-bold font-roboto mb-2">{results.bmr}</div>
                  <div className="text-sm text-text-secondary">
                    Calories/day at rest
                  </div>
                </div>
                
                {/* TDEE */}
                <div className="bg-dark/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Total Daily Energy Expenditure</h4>
                    <span className="text-sm px-2 py-1 rounded bg-warning/20 text-warning">
                      Maintenance
                    </span>
                  </div>
                  <div className="text-3xl font-bold font-roboto mb-2">{results.tdee}</div>
                  <div className="text-sm text-text-secondary">
                    Calories/day with activity
                  </div>
                </div>
              </div>
            </div>
            
            {/* Calorie Recommendations Card */}
            <div className="card mb-8 border border-warning/30 hover-glow-warning">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <FiActivity className="mr-2 text-warning" />
                Calorie Recommendations by Goal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Weight Loss */}
                <div className="bg-dark/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Weight Loss</h4>
                    <span className="text-sm px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                      Caloric Deficit
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conservative (0.5 lb/week):</span>
                      <span className="font-bold">{results.calorieRecommendations.weightLoss.conservative}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Moderate (1 lb/week):</span>
                      <span className="font-bold">{results.calorieRecommendations.weightLoss.moderate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Aggressive (1.5 lb/week):</span>
                      <span className="font-bold">{results.calorieRecommendations.weightLoss.aggressive}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-text-secondary">
                    Protein: {results.macroRatios.weightLoss.protein} | Carbs: {results.macroRatios.weightLoss.carbs} | Fats: {results.macroRatios.weightLoss.fats}
                  </div>
                </div>
                
                {/* Muscle Gain */}
                <div className="bg-dark/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Muscle Gain</h4>
                    <span className="text-sm px-2 py-1 rounded bg-green-500/20 text-green-300">
                      Caloric Surplus
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Lean Bulk (minimal fat):</span>
                      <span className="font-bold">{results.calorieRecommendations.muscleGain.lean}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Moderate Bulk:</span>
                      <span className="font-bold">{results.calorieRecommendations.muscleGain.moderate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Aggressive Bulk:</span>
                      <span className="font-bold">{results.calorieRecommendations.muscleGain.aggressive}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-text-secondary">
                    Protein: {results.macroRatios.muscleGain.protein} | Carbs: {results.macroRatios.muscleGain.carbs} | Fats: {results.macroRatios.muscleGain.fats}
                  </div>
                </div>
                
                {/* Maintenance & Nutrition */}
                <div className="bg-dark/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Maintenance & Nutrition</h4>
                    <span className="text-sm px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                      Daily Needs
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm mb-1">Maintenance Calories:</div>
                      <div className="font-bold">{results.calorieRecommendations.maintenance}</div>
                    </div>
                    <div>
                      <div className="text-sm mb-1">Daily Water Intake:</div>
                      <div className="font-bold">{results.waterIntake} liters</div>
                    </div>
                    <div>
                      <div className="text-sm mb-1">Protein Needs:</div>
                      <div className="font-bold">{results.proteinNeeds.min}-{results.proteinNeeds.max}g per day</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-text-secondary">
                    Protein: {results.macroRatios.maintenance.protein} | Carbs: {results.macroRatios.maintenance.carbs} | Fats: {results.macroRatios.maintenance.fats}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-dark/50 rounded-lg border border-warning/20">
                <div className="flex items-start">
                  <div className="text-warning mr-3 mt-1">
                    <FiAlertCircle />
                  </div>
                  <p className="text-sm">
                    <strong>Safety Note:</strong> Never consume fewer than {formData.gender === 'male' ? '1,500' : '1,200'} calories daily. Adjust recommendations based on individual response and consult healthcare providers before starting any nutrition plan.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recommendations Card */}
            <div className="card border border-success/30 hover-glow-success">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <FiCheckCircle className="mr-2 text-success" />
                Personalized Recommendations
              </h3>
              
              <div className="space-y-4">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-success mr-3 mt-1">
                      <FiCheckCircle />
                    </div>
                    <p>{recommendation}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-dark/50 rounded-lg border border-warning/20">
                <div className="flex items-start">
                  <div className="text-warning mr-3 mt-1">
                    <FiAlertCircle />
                  </div>
                  <p className="text-sm">
                    <strong>Important:</strong> This assessment provides general guidance based on the information you provided. For a more accurate and personalized fitness plan, consider consulting with a certified fitness professional or healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}