import { useEffect, useState } from "react";

import { skillsData } from "../data/skills";
import type { SkillCategoryKey } from "../types";

export function SkillsWidget() {
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategoryKey>("frontend");
  const [animateSkills, setAnimateSkills] = useState(false);

  useEffect(() => {
    setAnimateSkills(false);
    const timer = window.setTimeout(() => setAnimateSkills(true), 100);
    return () => window.clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <div className="skills-widget viewport-animate">
      <div className="mb-8 flex flex-wrap gap-3 border-b-2 border-zinc-200 pb-4">
        {(Object.keys(skillsData) as SkillCategoryKey[]).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-md px-4 py-2 font-medium capitalize transition-all duration-300 ${
              selectedCategory === category
                ? "bg-brand-primary text-white"
                : "bg-zinc-100 text-zinc-500 hover:-translate-y-0.5 hover:bg-brand-primary hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 max-w-full flex-wrap items-start justify-start gap-2 lg:min-w-[1000px] lg:max-w-[1000px]">
        {skillsData[selectedCategory].map((skill, index) => (
          <span
            key={skill.name}
            className={`inline-block rounded-full px-5 py-3 text-sm font-medium shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
              animateSkills ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
            style={{
              backgroundColor: skill.color,
              color:
                skill.color === "#F59E0B" ||
                skill.color === "#10B981" ||
                skill.color === "#00C7B7"
                  ? "#000"
                  : "#fff",
              transitionDelay: `${index * 0.05}s`,
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
