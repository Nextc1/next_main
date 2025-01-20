"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "../../utils/cn";

interface TabProps {
  text: string;
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function PriceBar({ tabs, ...props }) {
  const [selected, setSelected] = useState<string>(tabs[0]);

  useEffect(() => {
    props.setCurrency(selected);
    console.log(selected);
  }, [selected]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-0 p-0 rounded-full w-fit bg-black/10">
      {tabs.map((tab) => (
        <Tab
          text={tab}
          selected={selected === tab}
          setSelected={setSelected}
          key={tab}
        />
      ))}
    </div>
  );
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "relative rounded-md p-2 text-sm transition-all",
        selected ? "text-white font-bold" : "text-black font-bold"
      )}
    >
      <p className="relative z-50 min-w-20">{text}</p>
      {selected && (
        <motion.span
          layoutId="tabs"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 bg-black rounded-full"
        />
      )}
    </button>
  );
};
