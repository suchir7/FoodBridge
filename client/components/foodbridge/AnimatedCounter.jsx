import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40%" });
  const [display, setDisplay] = useState(() => Math.floor(0).toLocaleString());

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration,
      onUpdate: (v) => setDisplay(Math.floor(v).toLocaleString()),
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      <span>{prefix}</span>
      <span>{display}</span>
      <span>{suffix}</span>
    </span>
  );
}
