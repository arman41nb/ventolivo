"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type RevealDirection = "up" | "down" | "left" | "right";

type ViewportRevealProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: number;
  scaleFrom?: number;
  threshold?: number;
  once?: boolean;
  direction?: RevealDirection;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "children" | "className" | "style"
>;

function getOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    case "up":
    default:
      return { x: 0, y: distance };
  }
}

export default function ViewportReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  style,
  delay = 0,
  duration = 560,
  distance = 30,
  blur = 10,
  scaleFrom = 0.98,
  threshold = 0.18,
  once = true,
  direction = "up",
  ...rest
}: ViewportRevealProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once, prefersReducedMotion, threshold]);

  const offset = getOffset(direction, distance);
  const isVisible = prefersReducedMotion || visible;
  const motionStyle: CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: `translate3d(${isVisible ? 0 : offset.x}px, ${isVisible ? 0 : offset.y}px, 0) scale(${isVisible ? 1 : scaleFrom})`,
    filter: `blur(${isVisible ? 0 : blur}px)`,
    transitionProperty: "transform, opacity, filter",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
    willChange: "transform, opacity, filter",
  };

  return (
    <Component
      ref={ref as never}
      className={className}
      style={motionStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}
