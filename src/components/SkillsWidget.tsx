import { useState } from "react";

import { skillsData } from "../data/skills";
import type { SkillCategoryKey } from "../types";

export function SkillsWidget() {
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategoryKey>("frontend");
  const [animateSkills, setAnimateSkills] = useState(true);

  const handleCategorySelect = (category: SkillCategoryKey) => {
    setSelectedCategory(category);
    setAnimateSkills(false);
    window.setTimeout(() => setAnimateSkills(true), 60);
  };

  return (
    <div className="skills-widget w-full h-auto">
      <div className="mb-8 flex flex-wrap justify-center gap-3 border-b border-[color-mix(in_srgb,var(--color-border)_35%,transparent)] pb-4">
        {(Object.keys(skillsData) as SkillCategoryKey[]).map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategorySelect(category)}
            className={`cursor-pointer rounded-full px-4 py-2 font-semibold capitalize transition-all duration-300 ${
              selectedCategory === category
                ? "bg-[var(--color-link)] text-[#0a0a0a]"
                : "bg-[color-mix(in_srgb,var(--color-border)_10%,transparent)] text-[var(--color-muted)] hover:-translate-y-0.5 hover:bg-[var(--color-link)] hover:text-[#0a0a0a]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-3 pt-6">
        {skillsData[selectedCategory].map((skill, index) => (
          <span
            key={skill.name}
            className={`inline-block cursor-default rounded-full border border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] px-5 py-3 text-sm font-semibold shadow transition-all duration-300 hover:scale-110 hover:shadow-md ${
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
