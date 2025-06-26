'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

type TestimonialColumnProps = {
  testimonials: Testimonial[];
  className?: string;
  duration?: number;
};

const TestimonialColumn = ({ testimonials, className = '', duration = 15 }: TestimonialColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  
  useEffect(() => {
    if (columnRef.current) {
      setColumnHeight(columnRef.current.scrollHeight);
    }
  }, [testimonials]);

  return (
    <div className={`flex flex-col gap-6 ${className} relative overflow-hidden h-[600px]`}>
      <motion.div
        ref={columnRef}
        animate={{
          y: [-20, -(columnHeight) + 500, -20]
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="flex flex-col gap-6"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: false, margin: "-100px" }}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-lg transition-all hover:border-neutral-700 hover:bg-neutral-900/80"
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm/6 text-neutral-300">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-neutral-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Duplicate the first few testimonials at the end for seamless looping */}
        {testimonials.slice(0, 2).map((testimonial, index) => (
          <motion.div
            key={`duplicate-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, margin: "-100px" }}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-lg transition-all hover:border-neutral-700 hover:bg-neutral-900/80"
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm/6 text-neutral-300">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-neutral-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="bg-background my-20 relative">
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 whitespace-nowrap">
            What Our Members Say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our members have to say about their experience with us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">

          <TestimonialColumn testimonials={firstColumn} duration={15} />
          <TestimonialColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}