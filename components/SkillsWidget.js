const { useState, useEffect } = React;

function SkillsWidget() {
  console.log("🛠️ SkillsWidget: Component initializing");
  const [selectedCategory, setSelectedCategory] = useState("frontend");
  const [animateSkills, setAnimateSkills] = useState(false);

  const skillsData = {
    frontend: [
      { name: "HTML5", color: "#E34F26" },
      { name: "CSS3", color: "#1572B6" },
      { name: "JavaScript (ES6+)", color: "#F59E0B" },
      { name: "React.js", color: "#61DAFB" },
      { name: "Responsive Design", color: "#10B981" },
      { name: "CSS Grid & Flexbox", color: "#6366F1" },
    ],
    backend: [
      { name: "Node.js", color: "#339933" },
      { name: "SQL", color: "#336791" },
      { name: "API Integration", color: "#6366F1" },
      { name: "Database Design", color: "#10B981" },
    ],
    tools: [
      { name: "Git/GitHub", color: "#F05032" },
      { name: "VS Code", color: "#007ACC" },
      { name: "Chrome DevTools", color: "#4285F4" },
      { name: "Testing & QA", color: "#8B5CF6" },
      { name: "Netlify", color: "#00C7B7" },
    ],
  };

  useEffect(() => {
    console.log("📂 SkillsWidget: Category changed to", selectedCategory);
    setAnimateSkills(false);
    const timer = setTimeout(() => setAnimateSkills(true), 100);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const SkillBadge = ({ skill, index }) =>
    React.createElement(
      "div",
      {
        className: "skill-badge viewport-animate",
        style: {
          display: "inline-block",
          padding: "0.75rem 1.25rem",
          margin: "0.5rem 0.5rem 0.5rem 0",
          backgroundColor: skill.color,
          color:
            skill.color === "#F59E0B" || skill.color === "#10B981" || skill.color === "#00C7B7"
              ? "#000"
              : "#fff",
          borderRadius: "25px",
          fontWeight: "500",
          fontSize: "0.9rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          transform: animateSkills ? "translateY(0)" : "translateY(20px)",
          opacity: animateSkills ? 1 : 0,
          "--animation-delay": `${index * 0.05}s`,
          cursor: "default",
        },
        onMouseEnter: (e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        },
        onMouseLeave: (e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        },
      },
      skill.name,
    );

  return React.createElement("div", { className: "skills-widget" }, [
    React.createElement(
      "div",
      {
        key: "tabs",
        className: "skills-tabs",
        style: {
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "2px solid #e9ecef",
          paddingBottom: "1rem",
        },
      },
      Object.keys(skillsData).map((category) =>
        React.createElement(
          "button",
          {
            key: category,
            onClick: () => setSelectedCategory(category),
            className: `skill-tab ${selectedCategory === category ? "active" : ""}`,
            style: {
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "500",
              textTransform: "capitalize",
            },
          },
          category,
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        key: "skills",
        className: "skills-list",
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        },
      },
      skillsData[selectedCategory].map((skill, index) =>
        React.createElement(SkillBadge, { key: skill.name, skill, index }),
      ),
    ),
  ]);
}

window.SkillsWidget = SkillsWidget;
