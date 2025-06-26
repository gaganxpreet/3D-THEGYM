// src/utils/pdf-generator.js
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a PDF from workout data
 * @param {Object} workoutData - The workout data to include in the PDF
 * @returns {Promise<Blob>} - A promise that resolves to the PDF blob
 */
export const generateWorkoutPDF = async (workoutData) => {
  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set up document properties
  pdf.setProperties({
    title: `${workoutData.workoutName} - 3D The Gym`,
    subject: 'Personalized Workout Plan',
    author: '3D The Gym',
    keywords: 'workout, fitness, exercise, personalized',
    creator: '3D The Gym'
  });

  // Add title
  pdf.setFontSize(24);
  pdf.setTextColor(33, 150, 243); // Primary color
  pdf.text(workoutData.workoutName, 20, 20);

  // Add description
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  const descriptionLines = pdf.splitTextToSize(workoutData.description, 170);
  pdf.text(descriptionLines, 20, 30);

  // Add workout details
  let yPosition = 30 + (descriptionLines.length * 7);

  // Add workout summary
  pdf.setFontSize(14);
  pdf.setTextColor(33, 150, 243);
  pdf.text('Workout Summary', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Difficulty: ${workoutData.difficulty}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Duration: ${workoutData.duration || '60'} minutes`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Estimated Calories: ~${workoutData.estimatedCalories}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Focus: ${workoutData.focus || workoutData.primaryMuscleGroups?.join(', ')}`, 20, yPosition);
  yPosition += 15;

  // Add warm-up section
  if (workoutData.warmup && workoutData.warmup.length > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(255, 152, 0); // Warm-up color (orange)
    pdf.text('Warm-up', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);

    workoutData.warmup.forEach((exercise, index) => {
      pdf.setTextColor(255, 152, 0);
      pdf.text(`${index + 1}. ${exercise.exercise}`, 20, yPosition);
      yPosition += 5;
      
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Duration: ${exercise.duration}`, 25, yPosition);
      yPosition += 5;
      
      const instructionLines = pdf.splitTextToSize(`Instructions: ${exercise.instructions}`, 165);
      pdf.text(instructionLines, 25, yPosition);
      yPosition += (instructionLines.length * 5) + 5;

      // Add YouTube link if available
      if (exercise.youtubeVideo && exercise.youtubeVideo.url) {
        pdf.setTextColor(0, 0, 255);
        pdf.text(`Video: ${exercise.youtubeVideo.url}`, 25, yPosition);
        pdf.link(25, yPosition - 5, 165, 6, { url: exercise.youtubeVideo.url });
        yPosition += 8;
      }
    });

    yPosition += 5;
  }

  // Add main workout section
  if (workoutData.mainWorkout && workoutData.mainWorkout.length > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(33, 150, 243); // Main workout color (blue)
    pdf.text('Main Workout', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);

    // Check if we need to add a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    workoutData.mainWorkout.forEach((exercise, index) => {
      // Check if we need to add a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setTextColor(33, 150, 243);
      pdf.text(`${index + 1}. ${exercise.exercise}`, 20, yPosition);
      yPosition += 5;
      
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.rest}`, 25, yPosition);
      yPosition += 5;
      
      if (exercise.targetMuscles && exercise.targetMuscles.length > 0) {
        pdf.text(`Target Muscles: ${exercise.targetMuscles.join(', ')}`, 25, yPosition);
        yPosition += 5;
      }
      
      const instructionLines = pdf.splitTextToSize(`Instructions: ${exercise.instructions}`, 165);
      pdf.text(instructionLines, 25, yPosition);
      yPosition += (instructionLines.length * 5) + 5;

      // Add YouTube link if available
      if (exercise.youtubeVideo && exercise.youtubeVideo.url) {
        pdf.setTextColor(0, 0, 255);
        pdf.text(`Video: ${exercise.youtubeVideo.url}`, 25, yPosition);
        pdf.link(25, yPosition - 5, 165, 6, { url: exercise.youtubeVideo.url });
        yPosition += 8;
      }
    });

    yPosition += 5;
  }

  // Check if we need to add a new page for cooldown
  if (yPosition > 250 && workoutData.cooldown && workoutData.cooldown.length > 0) {
    pdf.addPage();
    yPosition = 20;
  }

  // Add cooldown section
  if (workoutData.cooldown && workoutData.cooldown.length > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(3, 169, 244); // Cooldown color (light blue)
    pdf.text('Cool-down', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);

    workoutData.cooldown.forEach((exercise, index) => {
      pdf.setTextColor(3, 169, 244);
      pdf.text(`${index + 1}. ${exercise.exercise}`, 20, yPosition);
      yPosition += 5;
      
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Duration: ${exercise.duration}`, 25, yPosition);
      yPosition += 5;
      
      const instructionLines = pdf.splitTextToSize(`Instructions: ${exercise.instructions}`, 165);
      pdf.text(instructionLines, 25, yPosition);
      yPosition += (instructionLines.length * 5) + 5;

      // Add YouTube link if available
      if (exercise.youtubeVideo && exercise.youtubeVideo.url) {
        pdf.setTextColor(0, 0, 255);
        pdf.text(`Video: ${exercise.youtubeVideo.url}`, 25, yPosition);
        pdf.link(25, yPosition - 5, 165, 6, { url: exercise.youtubeVideo.url });
        yPosition += 8;
      }
    });

    yPosition += 5;
  }

  // Check if we need to add a new page for notes
  if (yPosition > 250 && workoutData.notes && workoutData.notes.length > 0) {
    pdf.addPage();
    yPosition = 20;
  }

  // Add notes section
  if (workoutData.notes && workoutData.notes.length > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(255, 193, 7); // Notes color (amber)
    pdf.text('Important Notes', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);

    workoutData.notes.forEach((note, index) => {
      const noteLines = pdf.splitTextToSize(`${index + 1}. ${note}`, 165);
      pdf.text(noteLines, 20, yPosition);
      yPosition += (noteLines.length * 5) + 5;
    });
  }

  // Add footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Generated by 3D The Gym - AI Workout Generator', 20, 285);
  pdf.text(new Date().toLocaleDateString(), 170, 285, { align: 'right' });

  // Return the PDF as a blob
  return pdf.output('blob');
};

/**
 * Generate a PDF from a DOM element
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {string} filename - The name of the PDF file
 * @returns {Promise<void>}
 */
export const generatePDFFromElement = async (element, filename = 'workout.pdf') => {
  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      letterRendering: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    throw error;
  }
};

/**
 * Share workout data
 * @param {Object} workoutData - The workout data to share
 * @returns {Promise<void>}
 */
export const shareWorkout = async (workoutData) => {
  try {
    // Check if Web Share API is available
    if (navigator.share) {
      await navigator.share({
        title: `${workoutData.workoutName} - 3D The Gym`,
        text: `Check out my personalized workout plan: ${workoutData.workoutName}\n\n${workoutData.description}`,
        url: window.location.href,
      });
      return true;
    } else {
      // Fallback for browsers that don't support Web Share API
      // Create a shareable link or text
      const shareText = `${workoutData.workoutName} - 3D The Gym\n\n${workoutData.description}\n\nGenerated at: ${window.location.href}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareText);
      return 'copied';
    }
  } catch (error) {
    console.error('Error sharing workout:', error);
    throw error;
  }
};

/**
 * Save workout to local storage
 * @param {Object} workoutData - The workout data to save
 * @returns {void}
 */
export const saveWorkout = (workoutData) => {
  try {
    // Get existing saved workouts
    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
    
    // Add the new workout with a timestamp
    const workoutToSave = {
      ...workoutData,
      id: Date.now(), // Use timestamp as ID
      savedAt: new Date().toISOString(),
    };
    
    // Add to the beginning of the array
    savedWorkouts.unshift(workoutToSave);
    
    // Save back to local storage
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
    
    return workoutToSave.id;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
};

/**
 * Get all saved workouts from local storage
 * @returns {Array} - Array of saved workouts
 */
export const getSavedWorkouts = () => {
  try {
    return JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
  } catch (error) {
    console.error('Error getting saved workouts:', error);
    return [];
  }
};