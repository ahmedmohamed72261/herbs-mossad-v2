import { motion, AnimatePresence, useInView } from 'motion/react';
import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react';

const StaggerContext = createContext(false);
const easeCurve = 'cubic-bezier(0.22, 1, 0.36, 1)';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  amount?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (inView) {
      setHasEntered(true);
    }
  }, [inView]);

  const isVisible = inView || hasEntered;

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.6s ${easeCurve} ${delay}s, transform 0.6s ${easeCurve} ${delay}s`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export function StaggerScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (inView) {
      setHasEntered(true);
    }
  }, [inView]);

  const isVisible = inView || hasEntered;

  return (
    <StaggerContext.Provider value={isVisible}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (inView) {
      setHasEntered(true);
    }
  }, [inView]);

  const isVisible = inView || hasEntered;

  return (
    <StaggerContext.Provider value={isVisible}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

export function StaggerItem({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const isParentVisible = useContext(StaggerContext);

  return (
    <div
      style={{
        opacity: isParentVisible ? 1 : 0,
        transform: isParentVisible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.5s ${easeCurve} ${delay}s, transform 0.5s ${easeCurve} ${delay}s`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  y = 20,
  className,
  ...props
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  [key: string]: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (inView) {
      setHasEntered(true);
    }
  }, [inView]);

  const isVisible = inView || hasEntered;

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.55s ${easeCurve} ${delay}s, transform 0.55s ${easeCurve} ${delay}s`,
        willChange: 'opacity, transform',
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export { motion, AnimatePresence };
