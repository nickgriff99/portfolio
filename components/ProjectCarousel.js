function ProjectFilter() {
  console.log("🎠 ProjectCarousel: Component initializing");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [projects, setProjects] = React.useState([]);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);

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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  React.useEffect(() => {
    console.log("🎲 ProjectCarousel: Shuffling projects data, total projects:", projectsData.length);
    const shuffledProjects = shuffleArray(projectsData);
    setProjects(shuffledProjects);
    console.log("✅ ProjectCarousel: Projects loaded and shuffled");
  }, []);

  React.useEffect(() => {
    if (projects.length === 0 || isPaused) return;

    console.log("⏰ ProjectCarousel: Starting auto-slide interval");
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [projects.length, currentIndex, isPaused]);

  const handleTransition = () => {
    if (isTransitioning) {
      setIsTransitioning(false);
      setTimeout(() => setIsTransitioning(true), 50);
      setTimeout(() => setIsTransitioning(false), 400);
    } else {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  };

  const nextSlide = () => {
    console.log("➡️ ProjectCarousel: Next slide triggered");
    setIsPaused(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    handleTransition();
  };

  const prevSlide = () => {
    console.log("⬅️ ProjectCarousel: Previous slide triggered");
    setIsPaused(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1,
    );
    handleTransition();
  };

  const goToSlide = (index) => {
    console.log("🎯 ProjectCarousel: Going to slide", index);
    setIsPaused(false);
    setCurrentIndex(index);
    handleTransition();
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setIsPaused(true);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setIsDragging(false);
    setIsPaused(false);
  };

  const onMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
    setIsPaused(true);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!touchStart || !touchEnd || !isDragging) {
      setIsDragging(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setIsDragging(false);
    setIsPaused(false);
  };

  if (projects.length === 0) {
    return React.createElement(
      "div",
      {
        style: { textAlign: "center", padding: "3rem", color: "#666" },
      },
      "Loading projects...",
    );
  }

  const createProjectCard = (project, index) => {
    const offset = index - currentIndex;
    const normalizedOffset =
      offset > projects.length / 2
        ? offset - projects.length
        : offset < -projects.length / 2
          ? offset + projects.length
          : offset;

    const isActive = normalizedOffset === 0;
    const isVisible = Math.abs(normalizedOffset) <= 2;

    if (!isVisible) return null;

    let transform = "translateX(0) translateY(0) scale(1) rotateY(0deg)";
    let zIndex = 10;
    let opacity = 1;
    let pointerEvents = "auto";

    if (normalizedOffset === -2) {
      transform =
        "translateX(-120%) translateY(30px) scale(0.6) rotateY(-30deg)";
      zIndex = 1;
      opacity = 0;
      pointerEvents = "none";
    } else if (normalizedOffset === -1) {
      transform =
        "translateX(-80%) translateY(20px) scale(0.85) rotateY(-15deg)";
      zIndex = 1;
      opacity = 0.7;
      pointerEvents = "none";
    } else if (normalizedOffset === 0) {
      transform = "translateX(0) translateY(0) scale(1) rotateY(0deg)";
      zIndex = 1000;
      opacity = 1;
      pointerEvents = "auto";
    } else if (normalizedOffset === 1) {
      transform = "translateX(80%) translateY(20px) scale(0.85) rotateY(15deg)";
      zIndex = 1;
      opacity = 0.7;
      pointerEvents = "none";
    } else if (normalizedOffset === 2) {
      transform = "translateX(120%) translateY(30px) scale(0.6) rotateY(30deg)";
      zIndex = 1;
      opacity = 0;
      pointerEvents = "none";
    }

    return React.createElement(
      "div",
      {
        key: `card-${project.id}`,
        className:
          `carousel-card viewport-animate ${isActive ? "active current" : "inactive"} ${normalizedOffset < 0 ? "prev" : normalizedOffset > 0 ? "next" : ""}`.trim(),
        onMouseEnter: () => {
          if (isActive) {
            setIsPaused(true);
          }
        },
        onMouseLeave: () => {
          if (isActive) {
            setIsPaused(false);
          }
        },
        style: {
          position: "absolute",
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: isActive
            ? "0 25px 50px rgba(0, 0, 0, 0.2)"
            : "0 15px 30px rgba(0, 0, 0, 0.1)",
          transform: transform,
          transition: isTransitioning
            ? "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)"
            : "all 1s cubic-bezier(0.165, 0.84, 0.44, 1)",
          zIndex: zIndex,
          opacity: opacity,
          cursor: isActive ? "default" : "pointer",
          pointerEvents: pointerEvents,
        },
        onClick: () => {
          if (!isActive && Math.abs(normalizedOffset) === 1) {
            if (normalizedOffset === -1) prevSlide();
            if (normalizedOffset === 1) nextSlide();
          }
        },
      },
      [
        React.createElement(
          "div",
          {
            key: "image",
            style: {
              height: "250px",
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.4rem",
              fontWeight: "bold",
              position: "relative",
            },
          },
          project.title,
        ),

        React.createElement(
          "div",
          {
            key: "content",
            style: {
              padding: "2rem",
            },
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
                React.createElement("div", { key: "title-section" }, [
                  React.createElement(
                    "h3",
                    {
                      key: "title",
                      style: {
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.4rem",
                        color: "var(--gray-800)",
                      },
                    },
                    project.title,
                  ),
                  React.createElement(
                    "span",
                    {
                      key: "category",
                      style: {
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        backgroundColor:
                          project.category === "frontend"
                            ? "var(--secondary-color)"
                            : "var(--accent-color)",
                        color: "white",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                      },
                    },
                    project.category,
                  ),
                ]),
                React.createElement(
                  "a",
                  {
                    key: "github-link",
                    href: isActive ? project.githubLink : "#",
                    target: isActive ? "_blank" : "_self",
                    rel: isActive ? "noopener noreferrer" : "",
                    style: {
                      display: "inline-block",
                      padding: "0.5rem 1rem",
                      backgroundColor: isActive
                        ? "var(--primary-color)"
                        : "var(--text-medium)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      transition: "background-color 0.3s ease",
                      cursor: isActive ? "pointer" : "default",
                      pointerEvents: isActive ? "auto" : "none",
                      opacity: isActive ? 1 : 0.6,
                    },
                    onClick: (e) => {
                      if (!isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    },
                  },
                  "View Code",
                ),
              ],
            ),

            React.createElement(
              "p",
              {
                key: "description",
                style: {
                  color: "var(--gray-600)",
                  lineHeight: "1.6",
                  marginBottom: "1.5rem",
                  fontSize: "0.95rem",
                },
              },
              project.description,
            ),

            React.createElement(
              "div",
              {
                key: "tech-stack",
                style: {
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                },
              },
              project.tech.map((tech) =>
                React.createElement(
                  "span",
                  {
                    key: tech,
                    style: {
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "var(--gray-100)",
                      color: "var(--gray-700)",
                      borderRadius: "15px",
                      fontSize: "0.8rem",
                      border: "1px solid #dee2e6",
                    },
                  },
                  tech,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  };

  return React.createElement(
    "div",
    {
      className: `project-carousel-3d ${isDragging ? "dragging" : ""}`,
    },
    [
      React.createElement(
        "div",
        {
          key: "carousel-container",
          style: {
            position: "relative",
            height: "500px",
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            perspective: "1200px",
            perspectiveOrigin: "center center",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          },
          onTouchStart: onTouchStart,
          onTouchMove: onTouchMove,
          onTouchEnd: onTouchEnd,
          onMouseDown: onMouseDown,
          onMouseMove: onMouseMove,
          onMouseUp: onMouseUp,
          onMouseLeave: onMouseUp,
        },
        [
          React.createElement(
            "div",
            {
              key: "cards-container",
              style: {
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
            projects
              .map((project, index) => createProjectCard(project, index))
              .filter(Boolean),
          ),
        ],
      ),

      React.createElement(
        "div",
        {
          key: "controls",
          className: "carousel-controls",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem",
          },
        },
        [
          React.createElement(
            "button",
            {
              key: "prev",
              onClick: prevSlide,
              style: {
                padding: "0.75rem",
                backgroundColor: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                opacity: 1,
                transition: "all 0.3s ease",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              },
            },
            "‹",
          ),

          React.createElement(
            "div",
            {
              key: "dots",
              style: {
                display: "flex",
                gap: "0.5rem",
              },
            },
            projects.map((_, index) =>
              React.createElement("button", {
                key: index,
                onClick: () => goToSlide(index),
                style: {
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor:
                    index === currentIndex
                      ? "var(--primary-color)"
                      : "var(--text-light)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                },
              }),
            ),
          ),

          React.createElement(
            "button",
            {
              key: "next",
              onClick: nextSlide,
              style: {
                padding: "0.75rem",
                backgroundColor: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                opacity: 1,
                transition: "all 0.3s ease",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              },
            },
            "›",
          ),
        ],
      ),

      React.createElement(
        "div",
        {
          key: "counter",
          className: "carousel-counter",
          style: {
            textAlign: "center",
            marginTop: "1rem",
            color: "#666",
            fontSize: "0.9rem",
          },
        },
        `${currentIndex + 1} of ${projects.length}`,
      ),
    ],
  );
}

window.ProjectFilter = ProjectFilter;
