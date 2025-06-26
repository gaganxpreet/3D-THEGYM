'use client';

import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';

const StickyScroll = forwardRef<HTMLElement, React.HTMLProps<HTMLElement>>((props, ref) => {
  return (
    <ReactLenis root>
      <main className='bg-dark' ref={ref}>
        {props.children}
      </main>
    </ReactLenis>
  );
});

StickyScroll.displayName = 'StickyScroll';

export default StickyScroll;