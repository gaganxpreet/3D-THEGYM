import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
 
const cards = [ 
  { 
    title: 'AI-Powered Workout', 
    desc: 'Get personalized workouts in seconds using advanced AI technology that adapts to your fitness level and goals.', 
    gradientFrom: '#4361ee', 
    gradientTo: '#7209b7', 
    link: '/workout-ai'
  }, 
  { 
    title: 'Smart Nutrition Tracker', 
    desc: 'Track your daily nutrition with our comprehensive food database and get personalized recommendations for your diet.', 
    gradientFrom: '#06d6a0', 
    gradientTo: '#1b9aaa', 
    link: '/calorie-counter'
  }, 
  { 
    title: 'Fitness Assessment', 
    desc: 'Get detailed health analysis and personalized recommendations from our expert trainers to optimize your fitness journey.', 
    gradientFrom: '#f72585', 
    gradientTo: '#ff9e00', 
    link: '/fitness-assessment'
  }, 
]; 

export default function GradientCardShowcase() { 
  return ( 
    <> 
      <div className="flex justify-center items-center flex-wrap py-10 bg-dark"> 
        {cards.map(({ title, desc, gradientFrom, gradientTo, link }, idx) => ( 
          <div 
            key={idx} 
            className="group relative w-[320px] h-[400px] m-[20px_15px] md:m-[40px_30px] transition-all duration-500" 
          > 
            {/* Skewed gradient panels */} 
            <span 
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]" 
              style={{ 
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`, 
              }} 
            /> 
            <span 
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]" 
              style={{ 
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`, 
              }} 
            /> 

            {/* Animated blurs */} 
            <span className="pointer-events-none absolute inset-0 z-10"> 
              <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-100 animate-blob group-hover:top-[-50px] group-hover:left-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" /> 
              <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-500 animate-blob animation-delay-1000 group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" /> 
            </span> 

            {/* Content */} 
            <div className="relative z-20 left-0 p-[20px_40px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] shadow-lg rounded-lg text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[60px_40px] flex flex-col h-full"> 
              <h2 className="text-2xl mb-2">{title}</h2> 
              <p className="text-lg leading-relaxed mb-6">{desc}</p> 
              <div className="mt-auto">
                <Link 
                  href={link} 
                  className="inline-flex items-center space-x-2 text-lg font-bold text-white bg-transparent px-3 py-2 rounded border border-white/30 hover:bg-white/10 hover:border-white/50 hover:shadow-md transition-all duration-300" 
                > 
                  <span>Explore</span>
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link> 
              </div>
            </div> 
          </div> 
        ))} 
      </div>
    </> 
  ); 
}