import Image from "next/image";
import { useEffect, useState } from "react";

export default function TypingIndicator({
  text = "thinking",
}: {
  text?: string;
}) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 py-2">
      <Image
        src={"/oration_logo.png"}
        width={30}
        height={30}
        alt="oration_logo"
      />
      <span className="text-sm text-gray-400 font-medium">
        {text}
        <span className="inline-block w-5 ms-1">{dots}</span>
      </span>
    </div>
  );
}
