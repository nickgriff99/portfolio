function ProjectFilter() {
  console.log("ProjectFilter component initializing...");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [projects, setProjects] = React.useState([]);

  const projectsData = [
    {
      id: 1,
      title: "Discord Bot",
      category: "backend",
      description:
        "A feature-rich Discord bot built with Node.js, providing server management, moderation tools, and interactive commands for enhanced community engagement.",
      tech: ["Node.js", "Discord.js", "JavaScript", "API Integration"],
      image: "assets/images/discord-bot.jpg",
      demoLink: null,
      githubLink: "https://github.com/nickgriff99/discord-bot",
      featured: true,
    },
    {
      id: 2,
      title: "SaaS Landing Page",
      category: "frontend",
      description:
        "A modern, responsive SaaS landing page showcasing advanced CSS techniques, animations, and mobile-first design principles.",
      tech: ["HTML5", "CSS3", "Responsive Design", "CSS Animations"],
      image: "assets/images/saas-landing.jpg",
      demoLink: null,
      githubLink: "https://github.com/nickgriff99/css-final-project-saas",
      featured: true,
    },
    {
      id: 3,
      title: "Battleship Game",
      category: "frontend",
      description:
        "An interactive Battleship game application featuring game logic, user interface design, and engaging gameplay mechanics.",
      tech: ["JavaScript", "HTML5", "CSS3", "Game Logic"],
      image: "assets/images/battleship.jpg",
      demoLink: null,
      githubLink: "https://github.com/nickgriff99/battleship-app",
      featured: true,
    },
    {
      id: 4,
      title: "Node.js Calculator",
      category: "backend",
      description:
        "A server-side calculator application built with Node.js, demonstrating backend development skills and mathematical operations processing.",
      tech: ["Node.js", "Express.js", "JavaScript", "Backend Logic"],
      image: "assets/images/calculator.jpg",
      demoLink: null,
      githubLink: "https://github.com/nickgriff99/node-calculator",
      featured: false,
    },
    {
      id: 5,
      title: "Responsive Website",
      category: "frontend",
      description:
        "A fully responsive website demonstrating modern CSS techniques, mobile-first design, and cross-device compatibility.",
      tech: ["HTML5", "CSS3", "Responsive Design", "Mobile-First"],
      image: "assets/images/responsive-site.jpg",
      demoLink: null,
      githubLink: "https://github.com/nickgriff99/css-responsive-website",
      featured: false,
    },
  ];

  const filterCategories = [
    { key: "all", label: "All Projects" },
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
  ];

  React.useEffect(() => {
    console.log("🔍 ProjectFilter: Filter changed to", selectedFilter);
    const filteredProjects =
      selectedFilter === "all"
        ? projectsData
        : projectsData.filter((project) => project.category === selectedFilter);
    console.log("📊 ProjectFilter: Filtered projects count", filteredProjects.length);
    setProjects(filteredProjects);
  }, [selectedFilter]);

  const ProjectCard = ({ project, index }) =>
    React.createElement(
      "div",
      {
        className: "react-project-card viewport-animate",
        style: {
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "--animation-delay": `${index * 0.1}s`,
        },
      },
      [
        React.createElement(
          "div",
          {
            key: "image",
            className: "project-image",
            style: {
              height: "200px",
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            },
          },
          project.title,
        ),
        React.createElement(
          "div",
          {
            key: "content",
            className: "project-content",
            style: { padding: "1.5rem" },
          },
          [
            React.createElement(
              "div",
              {
                key: "header",
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                },
              },
              [
                React.createElement(
                  "h3",
                  {
                    key: "title",
                    style: { margin: 0, color: "#1F2937", fontSize: "1.25rem" },
                  },
                  project.title,
                ),
                project.featured &&
                  React.createElement(
                    "span",
                    {
                      key: "featured",
                      style: {
                        background: "#6366F1",
                        color: "white",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      },
                    },
                    "Featured",
                  ),
              ],
            ),
            React.createElement(
              "p",
              {
                key: "description",
                style: {
                  color: "#6B7280",
                  marginBottom: "1.5rem",
                  lineHeight: "1.6",
                },
              },
              project.description,
            ),
            React.createElement(
              "div",
              {
                key: "tech",
                className: "project-tech",
                style: {
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                },
              },
              project.tech.map((tech) =>
                React.createElement(
                  "span",
                  {
                    key: tech,
                    style: {
                      background: "#F9FAFB",
                      color: "#6B7280",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "15px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    },
                  },
                  tech,
                ),
              ),
            ),
            React.createElement(
              "div",
              {
                key: "links",
                className: "project-links",
                style: { display: "flex", gap: "1rem" },
              },
              [
                React.createElement(
                  "a",
                  {
                    key: "demo",
                    href: project.demoLink,
                    style: {
                      padding: "8px 16px",
                      background: "#6366F1",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "5px",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "background-color 0.3s ease",
                    },
                  },
                  "Live Demo",
                ),
                React.createElement(
                  "a",
                  {
                    key: "github",
                    href: project.githubLink,
                    style: {
                      padding: "8px 16px",
                      background: "transparent",
                      color: "#6366F1",
                      textDecoration: "none",
                      border: "2px solid #6366F1",
                      borderRadius: "5px",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    },
                  },
                  "GitHub",
                ),
              ],
            ),
          ],
        ),
      ],
    );

  return React.createElement("div", { className: "project-filter-widget" }, [
    React.createElement(
      "div",
      {
        key: "filters",
        className: "filter-buttons",
        style: {
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
        },
      },
      filterCategories.map((category) =>
        React.createElement(
          "button",
          {
            key: category.key,
            onClick: () => setSelectedFilter(category.key),
            style: {
              padding: "0.75rem 1.5rem",
              border: "none",
              background:
                selectedFilter === category.key ? "#6366F1" : "#F9FAFB",
              color: selectedFilter === category.key ? "white" : "#6B7280",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.3s ease",
              fontSize: "0.9rem",
            },
          },
          category.label,
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        key: "projects",
        className: "filtered-projects",
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
        },
      },
      projects.map((project, index) =>
        React.createElement(ProjectCard, { key: project.id, project, index }),
      ),
    ),
  ]);
}

const style = document.createElement("style");
style.textContent = `
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

window.ProjectFilter = ProjectFilter;
