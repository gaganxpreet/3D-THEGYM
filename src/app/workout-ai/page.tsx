'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Activity, 
  Clock, 
  Target, 
  Sliders, 
  RefreshCw, 
  Download, 
  Save, 
  Share2, 
  Info, 
  Check, 
  X, 
  Loader,
  Dumbbell,
  Heart,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react'
import { generateWorkoutPDF, shareWorkout as shareWorkoutUtil, saveWorkout, getSavedWorkouts } from '@/utils/pdf-generator'

// Gemini API Configuration (you'll need to install @google/generative-ai)
// npm install @google/generative-ai

export default function WorkoutAIPage() {
  // Define FormData interface to allow string indexing
  interface FormData {
    fitnessGoal: string;
    fitnessLevel: string;
    workoutDuration: string;
    primaryMuscleGroups: string[];
    secondaryMuscleGroups: string[];
    equipment: string[];
    injuries: string;
    preferences: string;
    [key: string]: string | string[];
  }

  // Form States
  const [formData, setFormData] = useState<FormData>({
    fitnessGoal: '',
    fitnessLevel: '',
    workoutDuration: '',
    primaryMuscleGroups: [],
    secondaryMuscleGroups: [],
    equipment: [],
    injuries: '',
    preferences: ''
  })

  // Define WorkoutData interface
  interface WorkoutData {
    title?: string;
    workoutName?: string;
    exercises?: any[];
    notes?: string;
    [key: string]: any;
  }
  
  // Type-safe wrapper for shareWorkout
  const shareWorkout = async (workoutData: WorkoutData): Promise<'copied' | boolean> => {
    try {
      // The original function returns either 'copied' or true
      await shareWorkoutUtil(workoutData)
      // Since we can't determine the exact return value, we'll assume it was successful
      return true
    } catch (error) {
      console.error('Error sharing workout:', error)
      return false
    }
  }

  // UI States
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutData | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showTooltips, setShowTooltips] = useState<Record<string, boolean>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const workoutResultsRef = useRef(null)

  // Gemini API Setup


  // Form Configuration with SVG Icons
  const muscleGroupCategories = [
    {
      category: 'Upper Body',
      muscles: ['Chest', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Forearms'],
      icon: <Dumbbell className="w-5 h-5" />
    },
    {
      category: 'Core',
      muscles: ['Abdominals', 'Obliques', 'Lower Back'],
      icon: <Target className="w-5 h-5" />
    },
    {
      category: 'Lower Body',
      muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      category: 'Full Body',
      muscles: ['Complete Body Workout'],
      icon: <Users className="w-5 h-5" />
    },
    {
      category: 'Functional',
      muscles: ['Movement-based Training'],
      icon: <Zap className="w-5 h-5" />
    }
  ]

  const equipmentOptions = [
    { name: 'None (Bodyweight)', icon: <Users className="w-6 h-6" /> },
    { name: 'Dumbbells', icon: <Dumbbell className="w-6 h-6" /> },
    { name: 'Barbell', icon: <Dumbbell className="w-6 h-6" /> },
    { name: 'Kettlebells', icon: <Dumbbell className="w-6 h-6" /> },
    { name: 'Resistance Bands', icon: <Zap className="w-6 h-6" /> },
    { name: 'Pull-up Bar', icon: <TrendingUp className="w-6 h-6" /> },
    { name: 'Bench', icon: <Sliders className="w-6 h-6" /> },
    { name: 'Cable Machine', icon: <Sliders className="w-6 h-6" /> },
    { name: 'Treadmill', icon: <Activity className="w-6 h-6" /> },
    { name: 'Exercise Bike', icon: <Activity className="w-6 h-6" /> },
    { name: 'Full Gym', icon: <Users className="w-6 h-6" /> }
  ]

  const fitnessGoalOptions = [
    { value: 'Build Strength', label: 'Build Strength', icon: <Dumbbell className="w-5 h-5" /> },
    { value: 'Build Muscle', label: 'Build Muscle', icon: <TrendingUp className="w-5 h-5" /> },
    { value: 'Improve Endurance', label: 'Improve Endurance', icon: <Activity className="w-5 h-5" /> },
    { value: 'Weight Loss', label: 'Weight Loss', icon: <Target className="w-5 h-5" /> },
    { value: 'Toning & Definition', label: 'Toning & Definition', icon: <Zap className="w-5 h-5" /> },
    { value: 'Improve Flexibility', label: 'Improve Flexibility', icon: <Users className="w-5 h-5" /> }
  ]

  const fitnessLevelOptions = [
    { value: 'Beginner', icon: <Users className="w-8 h-8" />, description: 'New to fitness' },
    { value: 'Intermediate', icon: <Heart className="w-8 h-8" />, description: 'Some experience' },
    { value: 'Advanced', icon: <Zap className="w-8 h-8" />, description: 'Experienced athlete' }
  ]

  // Validation Rules
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.fitnessGoal) errors.fitnessGoal = 'Please select your fitness goal'
    if (!formData.fitnessLevel) errors.fitnessLevel = 'Please select your fitness level'
    if (!formData.workoutDuration) errors.workoutDuration = 'Please select workout duration'
    if (formData.primaryMuscleGroups.length === 0) errors.primaryMuscleGroups = 'Select at least one muscle group'
    if (formData.equipment.length === 0) errors.equipment = 'Select at least one equipment option'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Handle array field changes (muscle groups, equipment)
  const toggleArrayField = (field: string, item: string) => {
    setFormData(prev => {
      const currentValue = prev[field];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: currentValue.includes(item)
            ? currentValue.filter((i: string) => i !== item)
            : [...currentValue, item]
        };
      }
      return prev;
    })
  }

  // Handle saving workout to local storage
  const handleSaveWorkout = async () => {
    if (!generatedWorkout) return
    
    try {
      setIsProcessing(true)
      // Add workout duration to the workout data
      const workoutToSave = {
        ...generatedWorkout,
        duration: formData.workoutDuration,
        focus: formData.primaryMuscleGroups.join(', ')
      }
      
      // Save to local storage
      const savedId = saveWorkout(workoutToSave)
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Workout saved successfully!',
        type: 'success'
      })
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' })
      }, 3000)
    } catch (error) {
      console.error('Error saving workout:', error)
      setNotification({
        show: true,
        message: 'Failed to save workout',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle downloading workout as PDF
  const handleDownloadPDF = async () => {
    if (!generatedWorkout) return
    
    try {
      setIsProcessing(true)
      // Add workout duration to the workout data
      const workoutToDownload = {
        ...generatedWorkout,
        duration: formData.workoutDuration,
        focus: formData.primaryMuscleGroups.join(', ')
      }
      
      // Generate and download PDF
      const pdfBlob = await generateWorkoutPDF(workoutToDownload)
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      const fileName = workoutToDownload.workoutName ? 
        workoutToDownload.workoutName.replace(/\s+/g, '-').toLowerCase() : 
        workoutToDownload.title ? 
          workoutToDownload.title.replace(/\s+/g, '-').toLowerCase() : 
          'workout'
      link.download = `${fileName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Show success notification
      setNotification({
        show: true,
        message: 'PDF downloaded successfully!',
        type: 'success'
      })
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' })
      }, 3000)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      setNotification({
        show: true,
        message: 'Failed to download PDF',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle sharing workout
  const handleShareWorkout = async () => {
    if (!generatedWorkout) return
    
    try {
      setIsProcessing(true)
      // Add workout duration to the workout data
      const workoutToShare = {
        ...generatedWorkout,
        duration: formData.workoutDuration,
        focus: formData.primaryMuscleGroups.join(', ')
      }
      
      // Share workout
      const result = await shareWorkout(workoutToShare)
      
      // Show success notification
      if (result === 'copied') {
        setNotification({
          show: true,
          message: 'Workout details copied to clipboard!',
          type: 'success'
        })
      } else if (result === true) {
        setNotification({
          show: true,
          message: 'Workout shared successfully!',
          type: 'success'
        })
      }
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' })
      }, 3000)
    } catch (error) {
      console.error('Error sharing workout:', error)
      setNotification({
        show: true,
        message: 'Failed to share workout',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Generate AI Workout
const generateAIWorkout = async () => {
  if (!validateForm()) {
    alert('Please fill in all required fields')
    return
  }

  setIsGenerating(true)
  setNotification({ show: false, message: '', type: '' })
  
  try {
    const prompt = `
      Create a detailed, personalized workout plan based on these parameters:
      
      Fitness Goal: ${formData.fitnessGoal}
      Fitness Level: ${formData.fitnessLevel}
      Workout Duration: ${formData.workoutDuration} minutes
      Primary Muscle Groups: ${formData.primaryMuscleGroups.join(', ')}
      Secondary Muscle Groups: ${formData.secondaryMuscleGroups.join(', ')}
      Available Equipment: ${formData.equipment.join(', ')}
      Injuries/Limitations: ${formData.injuries || 'None specified'}
      Preferences: ${formData.preferences || 'None specified'}
      
      Please provide a comprehensive workout plan in JSON format with the following structure:
      {
        "workoutName": "Descriptive workout name",
        "description": "Brief description of the workout",
        "warmup": [
          {"exercise": "Exercise name", "duration": "time", "instructions": "brief instructions"}
        ],
        "mainWorkout": [
          {
            "exercise": "Exercise name",
            "sets": number,
            "reps": "rep range or time",
            "rest": "rest time",
            "instructions": "form cues and tips",
            "targetMuscles": ["muscle1", "muscle2"]
          }
        ],
        "cooldown": [
          {"exercise": "Exercise name", "duration": "time", "instructions": "brief instructions"}
        ],
        "notes": [
          "Important safety tip or modification"
        ],
        "estimatedCalories": number,
        "difficulty": "Beginner/Intermediate/Advanced"
      }
      
      Make sure the workout is appropriate for the specified fitness level and uses only the available equipment.
      
      IMPORTANT: Your response MUST be valid JSON that can be parsed with JSON.parse(). Do not include any markdown formatting, code blocks, or explanatory text outside the JSON structure.
    `

    // Call your secure API route instead of external API
    const response = await fetch('/api/generate-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate workout')
    }

    const data = await response.json()
    
    // Check if we have enhanced workout data with YouTube links
    if (data.enhancedWorkout) {
      setGeneratedWorkout(data.enhancedWorkout)
      return
    }
    
    // If no enhanced data, fall back to parsing the text response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Try to parse JSON from the response
    let workoutData
    try {
      // First attempt: Try to parse the entire response as JSON
      try {
        workoutData = JSON.parse(text.trim())
      } catch (directParseError) {
        // Second attempt: Try to extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/)
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
        workoutData = JSON.parse(jsonString.trim())
      }
      
      // Ensure the workout data has all required fields
      workoutData = {
        workoutName: workoutData.workoutName || `${formData.fitnessGoal} Workout`,
        description: workoutData.description || `Custom workout for ${formData.fitnessLevel} level focusing on ${formData.primaryMuscleGroups.join(', ')}`,
        warmup: workoutData.warmup || [
          { exercise: "Dynamic Stretching", duration: "5 minutes", instructions: "Perform light movements to warm up the muscles" }
        ],
        mainWorkout: workoutData.mainWorkout || [],
        cooldown: workoutData.cooldown || [
          { exercise: "Static Stretching", duration: "5 minutes", instructions: "Hold each stretch for 20-30 seconds" }
        ],
        notes: workoutData.notes || [],
        estimatedCalories: workoutData.estimatedCalories || Math.round(parseInt(formData.workoutDuration) * 7),
        difficulty: workoutData.difficulty || formData.fitnessLevel
      }
      
      // Ensure each main workout exercise has all required fields
      workoutData.mainWorkout = workoutData.mainWorkout.map((exercise: any) => ({
        exercise: exercise.exercise || "Exercise",
        sets: exercise.sets || 3,
        reps: exercise.reps || "10-12",
        rest: exercise.rest || "60 seconds",
        instructions: exercise.instructions || "Perform with proper form",
        targetMuscles: exercise.targetMuscles || formData.primaryMuscleGroups
      }))
      
    } catch (parseError) {
      console.error('Error parsing workout data:', parseError)
      // If all JSON parsing attempts fail, create a structured response from the text
      workoutData = {
        workoutName: `${formData.fitnessGoal} Workout`,
        description: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        warmup: [
          { exercise: "Dynamic Stretching", duration: "5 minutes", instructions: "Perform light movements to warm up the muscles" }
        ],
        mainWorkout: [
          {
            exercise: "AI Generated Workout",
            sets: 3,
            reps: "As recommended",
            rest: "60 seconds",
            instructions: text,
            targetMuscles: formData.primaryMuscleGroups
          }
        ],
        cooldown: [
          { exercise: "Static Stretching", duration: "5 minutes", instructions: "Hold each stretch for 20-30 seconds" }
        ],
        notes: ["Follow the detailed instructions provided"],
        estimatedCalories: Math.round(parseInt(formData.workoutDuration) * 7),
        difficulty: formData.fitnessLevel
      }
    }

    setGeneratedWorkout(workoutData)
  } catch (error) {
    console.error('Error generating workout:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert(`Failed to generate workout: ${errorMessage}`)
  } finally {
    setIsGenerating(false)
  }
}


  // Tooltip Component
  const Tooltip = ({ content, children, field }: { content: string, children: React.ReactNode, field: string }) => (
    <div className="relative">
      <div
        onMouseEnter={() => setShowTooltips(prev => ({ ...prev, [field]: true }))}
        onMouseLeave={() => setShowTooltips(prev => ({ ...prev, [field]: false }))}
      >
        {children}
      </div>
      {showTooltips[field] && (
        <div className="absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg -top-8 left-0 whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  )

  // Form Steps
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Basic Information</h3>
      
      <div>
        <Tooltip content="Choose your primary fitness objective" field="fitnessGoal">
          <label className="text-sm font-medium mb-2 flex items-center">
            <Target className="mr-2 w-4 h-4" />
            Fitness Goal *
            <Info className="ml-1 text-gray-400 w-4 h-4" />
          </label>
        </Tooltip>
        <select 
          className={`w-full p-3 rounded-lg bg-gray-800 border ${validationErrors.fitnessGoal ? 'border-red-500' : 'border-gray-700'} focus:border-primary outline-none transition-colors`}
          value={formData.fitnessGoal}
          onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
        >
          <option value="">Select your goal</option>
          {fitnessGoalOptions.map((goal) => (
            <option key={goal.value} value={goal.value}>
              {goal.label}
            </option>
          ))}
        </select>
        {validationErrors.fitnessGoal && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <X className="mr-1 w-4 h-4" />
            {validationErrors.fitnessGoal}
          </p>
        )}
      </div>

      <div>
        <Tooltip content="Select your current fitness experience level" field="fitnessLevel">
          <label className="text-sm font-medium mb-2 flex items-center">
            <Activity className="mr-2 w-4 h-4" />
            Fitness Level *
            <Info className="ml-1 text-gray-400 w-4 h-4" />
          </label>
        </Tooltip>
        <div className="grid grid-cols-3 gap-3">
          {fitnessLevelOptions.map((level) => (
            <div
              key={level.value}
              onClick={() => handleInputChange('fitnessLevel', level.value)}
              className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${
                formData.fitnessLevel === level.value
                  ? 'bg-primary/20 border-primary'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-center mb-2">
                {level.icon}
              </div>
              <span className="text-sm font-medium">{level.value}</span>
              <p className="text-xs text-gray-400 mt-1">{level.description}</p>
            </div>
          ))}
        </div>
        {validationErrors.fitnessLevel && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <X className="mr-1 w-4 h-4" />
            {validationErrors.fitnessLevel}
          </p>
        )}
      </div>

      <div>
        <Tooltip content="How long do you want to work out?" field="workoutDuration">
          <label className="text-sm font-medium mb-2 flex items-center">
            <Clock className="mr-2 w-4 h-4" />
            Workout Duration *
            <Info className="ml-1 text-gray-400 w-4 h-4" />
          </label>
        </Tooltip>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {['15', '30', '45', '60', '90', '120'].map((duration) => (
            <div
              key={duration}
              onClick={() => handleInputChange('workoutDuration', duration)}
              className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                formData.workoutDuration === duration
                  ? 'bg-primary/20 border-primary'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-500'
              }`}
            >
              <span className="text-sm font-medium">{duration} min</span>
            </div>
          ))}
        </div>
        {validationErrors.workoutDuration && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <X className="mr-1 w-4 h-4" />
            {validationErrors.workoutDuration}
          </p>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Target Muscle Groups</h3>
      
      <div>
        <Tooltip content="Select 1-3 primary muscle groups to focus on" field="primaryMuscleGroups">
          <label className="text-sm font-medium mb-2 flex items-center">
            <Target className="mr-2 w-4 h-4" />
            Primary Focus *
            <span className="ml-1 text-xs text-gray-400">(Select 1-3)</span>
            <Info className="ml-1 text-gray-400 w-4 h-4" />
          </label>
        </Tooltip>
        
        <div className="space-y-4">
          {muscleGroupCategories.map((category) => (
            <div key={category.category} className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center text-gray-300">
                <span className="mr-2">{category.icon}</span>
                {category.category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {category.muscles.map((muscle) => (
                  <div
                    key={muscle}
                    onClick={() => toggleArrayField('primaryMuscleGroups', muscle)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                      formData.primaryMuscleGroups.includes(muscle)
                        ? 'bg-primary/20 border-primary'
                        : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-sm">{muscle}</span>
                    {formData.primaryMuscleGroups.includes(muscle) && (
                      <Check className="ml-1 inline w-4 h-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {validationErrors.primaryMuscleGroups && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <X className="mr-1 w-4 h-4" />
            {validationErrors.primaryMuscleGroups}
          </p>
        )}
      </div>

      {/* Secondary Focus section removed as requested */}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Equipment & Preferences</h3>
      
      <div>
        <Tooltip content="Select all equipment you have access to" field="equipment">
          <label className="text-sm font-medium mb-2 flex items-center">
            <Sliders className="mr-2 w-4 h-4" />
            Available Equipment *
            <Info className="ml-1 text-gray-400 w-4 h-4" />
          </label>
        </Tooltip>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {equipmentOptions.map((item) => (
            <div
              key={item.name}
              onClick={() => toggleArrayField('equipment', item.name)}
              className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${
                formData.equipment.includes(item.name)
                  ? 'bg-primary/20 border-primary'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-center mb-2">{item.icon}</div>
              <span className="text-sm">{item.name}</span>
              {formData.equipment.includes(item.name) && (
                <Check className="ml-1 inline w-4 h-4" />
              )}
            </div>
          ))}
        </div>
        {validationErrors.equipment && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <X className="mr-1 w-4 h-4" />
            {validationErrors.equipment}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Injuries or Limitations
          <span className="ml-1 text-xs text-gray-400">(Optional)</span>
        </label>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary outline-none transition-colors"
          rows={3}
          placeholder="Describe any injuries, limitations, or areas to avoid..."
          value={formData.injuries}
          onChange={(e) => handleInputChange('injuries', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Additional Preferences
          <span className="ml-1 text-xs text-gray-400">(Optional)</span>
        </label>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary outline-none transition-colors"
          rows={3}
          placeholder="Any specific preferences, favorite exercises, or special requirements..."
          value={formData.preferences}
          onChange={(e) => handleInputChange('preferences', e.target.value)}
        />
      </div>
    </div>
  )

  const renderWorkoutResults = () => (
    <div className="space-y-6" ref={workoutResultsRef}>
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          {notification.message}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Target className="mr-2 w-6 h-6" />
          Generated Personalized Results
        </h2>
        <div className="flex space-x-2">
          <button 
            className="btn-secondary flex items-center space-x-1"
            onClick={handleSaveWorkout}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save</span>
          </button>
          <button 
            className="btn-secondary flex items-center space-x-1"
            onClick={handleDownloadPDF}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download PDF</span>
          </button>
          <button 
            className="btn-secondary flex items-center space-x-1"
            onClick={handleShareWorkout}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold">{generatedWorkout?.workoutName}</h3>
            <p className="text-gray-400 mt-2">{generatedWorkout?.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm rounded-full bg-primary/20 border border-primary/50 flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              {generatedWorkout?.difficulty}
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-secondary/20 border border-secondary/50 flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              ~{generatedWorkout?.estimatedCalories} cal
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formData.workoutDuration} min
            </span>
          </div>
        </div>

        {/* Warmup Section */}
        {generatedWorkout?.warmup && generatedWorkout?.warmup.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
              <Zap className="mr-2 w-5 h-5" />
              Warm-up
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedWorkout?.warmup.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    {exercise.youtubeVideo ? (
                      <a 
                        href={exercise.youtubeVideo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-yellow-300 hover:text-yellow-500 flex items-center"
                      >
                        {exercise.exercise}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="font-medium text-yellow-300">{exercise.exercise}</span>
                    )}
                    <span className="text-sm bg-yellow-500/20 px-2 py-1 rounded-full text-yellow-300">{exercise.duration}</span>
                  </div>
                  <p className="text-sm text-gray-300">{exercise.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Workout Section */}
        <div className="mb-6">
          <h4 className="text-lg font-bold mb-3 text-primary flex items-center">
            <Dumbbell className="mr-2 w-5 h-5" />
            Main Workout
          </h4>
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700 p-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800/80">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Exercise</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-300">Sets</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-300">Reps</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-300">Rest</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Target Muscles</th>
                </tr>
              </thead>
              <tbody>
                {generatedWorkout?.mainWorkout?.map((exercise: any, index: number) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        {exercise.youtubeVideo ? (
                          <a 
                            href={exercise.youtubeVideo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-white hover:text-primary flex items-center"
                          >
                            {exercise.exercise}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <div className="font-medium text-white">{exercise.exercise}</div>
                        )}
                        {exercise.instructions && (
                          <div className="text-sm text-gray-400 mt-1">{exercise.instructions}</div>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-4 px-2 font-medium">{exercise.sets}</td>
                    <td className="text-center py-4 px-2">{exercise.reps}</td>
                    <td className="text-center py-4 px-2 text-gray-300">{exercise.rest}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles?.map((muscle: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-primary/20 border border-primary/30">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cooldown Section */}
        {generatedWorkout?.cooldown && generatedWorkout?.cooldown.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 text-blue-400 flex items-center">
              <Heart className="mr-2 w-5 h-5" />
              Cool-down
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedWorkout?.cooldown.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    {exercise.youtubeVideo ? (
                      <a 
                        href={exercise.youtubeVideo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-300 hover:text-blue-500 flex items-center"
                      >
                        {exercise.exercise}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="font-medium text-blue-300">{exercise.exercise}</span>
                    )}
                    <span className="text-sm bg-blue-500/20 px-2 py-1 rounded-full text-blue-300">{exercise.duration}</span>
                  </div>
                  <p className="text-sm text-gray-300">{exercise.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {generatedWorkout?.notes && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-5 mb-6">
            <h4 className="font-bold mb-3 text-yellow-400 flex items-center">
              <Info className="mr-2 w-5 h-5" />
              Important Notes:
            </h4>
            <ul className="space-y-2">
              {Array.isArray(generatedWorkout.notes) ? (
                generatedWorkout.notes.map((note: string, index: number) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-yellow-400 mr-2 mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-300 flex items-start">
                  <span className="text-yellow-400 mr-2 mt-1">•</span>
                  <span>{generatedWorkout.notes}</span>
                </li>
              )}
            </ul>
          </div>
        )}
        
        {/* Workout Summary */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <h4 className="font-bold mb-3 text-white flex items-center">
            <Target className="mr-2 w-5 h-5" />
            Workout Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
              <Clock className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm text-gray-400">Duration</span>
              <span className="font-bold">{formData.workoutDuration} minutes</span>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
              <Target className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm text-gray-400">Focus</span>
              <span className="font-bold">{formData.primaryMuscleGroups.join(', ')}</span>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
              <Activity className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm text-gray-400">Intensity</span>
              <span className="font-bold">{generatedWorkout?.difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-warning/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Workout Generator</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Get personalized workout plans powered by AI. Simply fill out your preferences and let our advanced AI create the perfect workout for you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="lg:w-1/2">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Step {currentStep} of 3</span>
                    <span className="text-sm text-gray-400">{Math.round((currentStep / 3) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Sliders className="mr-2 w-6 h-6" />
                  Workout Parameters
                </h2>

                {/* Form Steps */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {currentStep < 3 ? (
                    <button
                      onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                      className="btn-primary"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={generateAIWorkout}
                      disabled={isGenerating}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="animate-spin w-4 h-4" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-4 h-4" />
                          <span>Generate AI Workout</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:w-1/2">
              {isGenerating ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold mb-2">Generating Your Workout...</h3>
                  <p className="text-gray-400">Our AI is analyzing your preferences and creating a personalized workout plan.</p>
                </div>
              ) : generatedWorkout ? (
                renderWorkoutResults()
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="text-4xl text-primary w-12 h-12" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Ready to Generate Your Workout?</h2>
                  <p className="text-gray-400 mb-6">
                    Complete the form on the left to get your personalized AI-generated workout plan.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p className="flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      Personalized to your fitness level
                    </p>
                    <p className="flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      Based on available equipment
                    </p>
                    <p className="flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      Tailored to your goals
                    </p>
                    <p className="flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      Generated by advanced AI
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
