import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, className = "" }) {
  const ref = useRef();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), o.disconnect()), { threshold: 0.15 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${on ? "in" : ""} ${className}`}>{children}</div>;
}
