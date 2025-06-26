'use client';

import React from 'react';
import Image from 'next/image';

interface StickyGalleryProps {
  title?: string;
  description?: string;
  className?: string;
}

const StickyGallery: React.FC<StickyGalleryProps> = ({ title, description, className }) => {
  return (
    <section className={`text-white w-full bg-dark ${className}`}>
      {/* Header section with grid background */}
      <div className='wrapper'>
        <section className='text-white h-screen w-full bg-dark grid place-content-center sticky top-0'>
          <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

          <div className="flex flex-col items-center justify-center">
            <p className="m-0 text-transparent text-5xl sm:text-7xl md:text-8xl font-bold uppercase animate-text-flow bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80&ixlib=rb-4.0.3')] bg-cover bg-clip-text opacity-90 tracking-tighter shadow-lg">{title || '3D THE GYM'}</p>
            <p className="m-0 text-transparent text-3xl sm:text-5xl md:text-6xl font-bold uppercase animate-text-reverse bg-[url('https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=900&auto=format&fit=crop&q=80&ixlib=rb-4.0.3')] bg-cover bg-clip-text opacity-90 mt-4">{description || 'Where Fitness Meets Innovation'}</p>
            <p className="text-lg text-text-secondary mt-8 animate-bounce-slow">Scroll down! <span className="inline-block ml-1">👇</span></p>
          </div>
        </section>
      </div>

      {/* Gallery section with sticky middle column */}
      <section className='text-white w-full bg-dark'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='grid gap-2 col-span-4'>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop'
                alt='Gym equipment'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop'
                alt='Fitness training'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop'
                alt='Workout session'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&auto=format&fit=crop'
                alt='Fitness equipment'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=500&auto=format&fit=crop'
                alt='Gym interior'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
          </div>
          <div className='sticky top-0 h-screen w-full col-span-4 gap-2 grid grid-rows-3'>
            <figure className='w-full h-full relative'>
              <Image
                src='https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=500&auto=format&fit=crop'
                alt='Personal training'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-full relative'>
              <Image
                src='https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&auto=format&fit=crop'
                alt='Group fitness'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-full relative'>
              <Image
                src='https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&auto=format&fit=crop'
                alt='Fitness technology'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
          </div>
          <div className='grid gap-2 col-span-4'>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop'
                alt='Strength training'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop'
                alt='Cardio equipment'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop'
                alt='Fitness class'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop'
                alt='Workout space'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
            <figure className='w-full h-96 relative'>
              <Image
                src='https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&auto=format&fit=crop'
                alt='Fitness assessment'
                fill
                className='transition-all duration-300 object-cover rounded-md'
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <footer className='group bg-dark'>
        <p className='text-[16vw] translate-y-20 leading-[100%] uppercase font-bold text-center text-transparent animate-text-flow bg-[url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80&ixlib=rb-4.0.3")] bg-cover bg-clip-text opacity-90 transition-all ease-linear tracking-tighter shadow-lg mb-20'>
          3D THE GYM
        </p>
      </footer>
    </section>
  );
};

export default StickyGallery;