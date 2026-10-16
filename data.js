// This file stores all editable portfolio content so the site can be updated without touching HTML.
const portfolioData = {
  profile: {
    name: "Sahiti Chhanam",
    shortName: "Sahiti",
    role: "Software Engineer in the Making",
    tagline: "I build things, break them, fix them, and explain them well.",
    location: "Nagpur, Maharashtra, India",
    email: "sahitichhanam@gmail.com",
    phone: "+91 762 096 0826",
    github: "https://github.com/Sahiti-web",
    linkedin: "https://www.linkedin.com/in/sahiti-chhanam-a010b1324",
    resume: "Sahiti_Chhanam_Resume.pdf",
    intro: "B.Tech student at Symbiosis Institute of Technology (SIT), Nagpur, specializing in Data Science. I enjoy writing clean, useful code, solving problems, and building projects end to end."
  },
  heroWords: [
    "Software Engineer in the Making",
    "Python Developer",
    "Problem Solver",
    "Tech & Literary Community Builder"
  ],
  stats: [
    { value: 4, label: "projects" },
    { value: 3, label: "internships" },
    { value: 5, label: "certifications" },
    { value: 2, label: "clubs" }
  ],
  about: {
    summary: "I am a B.Tech student at Symbiosis Institute of Technology (SIT), Nagpur, specializing in Data Science. I enjoy writing code, solving problems, and building projects end to end. I have completed internships in AI/ML, built real-world projects, studied Linux system administration and Data Structures & Algorithms in Python, and I am active in leadership through ACM and the Literary Club. I am looking for software engineering internships and roles, and I am open to other tech roles.",
    careerInterests: [
      "Software Engineer",
      "Backend/Python Developer",
      "Full-Stack (learning)",
      "Data/ML Engineer",
      "Open to other roles"
    ],
    beyondCode: [
      "Sports (SportSpectra, Rival Rumble)",
      "Literature",
      "Event organizing",
      "Community building"
    ],
    headline: "I like building systems that make sense, ship clean solutions, and keep learning difficult things well."
  },
  education: {
    school: "Symbiosis Institute of Technology, Nagpur",
    degree: "B.Tech",
    specialization: "Data Science",
    status: "Present",
    graduationYear: "[add details]",
    secondary: {
      name: "St. Paul School",
      city: "[add details]",
      board: "[add details]",
      stream: "[add details]",
      year: "[add details]",
      percentage: "[add details]"
    },
    matriculation: {
      name: "Podar International School",
      city: "[add details]",
      board: "[add details]",
      year: "[add details]",
      percentage: "[add details]"
    },
    coursework: [
      "Python",
      "C",
      "Data Structures & Algorithms",
      "Linux (Red Hat System Administration)",
      "Machine Learning",
      "Statistics",
      "Git",
      "GitHub",
      "VS Code",
      "Jupyter Notebook",
      "Google Colab",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Scikit-learn",
      "GeoPandas",
      "SHAP",
      "Regression",
      "Classification",
      "Clustering",
      "PCA",
      "Feature Engineering",
      "EDA",
      "Agentic AI"
    ]
  },
  skills: [
    {
      category: "Languages & Web Technologies",
      items: [
        { name: "Python", level: 90 },
        { name: "Java", level: 85 },
        { name: "C", level: 80 },
        { name: "C++", level: 82 },
        { name: "JavaScript", level: 85 },
        { name: "SQL", level: 84 },
        { name: "HTML", level: 88 },
        { name: "CSS", level: 88 }
      ]
    },
    {
      category: "Core CS",
      items: [
        { name: "Data Structures & Algorithms", level: 87 },
        { name: "Problem Solving", level: 88 }
      ]
    },
    {
      category: "Systems & Tools",
      items: [
        { name: "Linux (Red Hat System Administration)", level: 84 },
        { name: "Git", level: 82 },
        { name: "GitHub", level: 84 },
        { name: "VS Code", level: 85 },
        { name: "Jupyter Notebook", level: 82 },
        { name: "Google Colab", level: 78 }
      ]
    },
    {
      category: "Data & ML",
      items: [
        { name: "Pandas", level: 88 },
        { name: "NumPy", level: 84 },
        { name: "Matplotlib", level: 82 },
        { name: "Seaborn", level: 80 },
        { name: "Scikit-learn", level: 86 },
        { name: "GeoPandas", level: 76 },
        { name: "SHAP", level: 74 },
        { name: "Regression", level: 82 },
        { name: "Classification", level: 80 },
        { name: "Clustering", level: 78 },
        { name: "PCA", level: 74 },
        { name: "Feature Engineering", level: 80 },
        { name: "EDA", level: 85 },
        { name: "Agentic AI", level: 80 }
      ]
    },
    {
      category: "Leadership & Communication",
      items: [
        { name: "Leadership", level: 84 },
        { name: "Team Coordination", level: 82 },
        { name: "Event Management", level: 80 },
        { name: "Communication", level: 82 }
      ]
    }
  ],
  projects: [
    {
      id: "district-ed-performance",
      title: "India District Education Performance Analysis",
      category: "ml",
      tech: ["Python", "Scikit-learn", "SHAP", "GeoPandas"],
      summary: "End-to-end ML pipeline on India's NAS dataset covering 1,399 districts to identify at-risk regions and visualize disparity.",
      highlight: "R² = 0.99 with SHAP-based insights",
      gh: "https://github.com/Sahiti-web/india-education-performance-analysis",
      details: [
        "End-to-end ML pipeline (regression, clustering, classification) on India's NAS dataset covering 1,399 districts to identify at-risk regions.",
        "SHAP with Random Forest (R² = 0.99) identified the key drivers; the top feature explained about 39% of variance.",
        "PCA + K-Means segmented districts into Struggling, Average and High tiers.",
        "95% accuracy predicting at-risk districts using minimal features.",
        "Geographic disparities were visualized with GeoPandas choropleth maps."
      ],
      image: "assets/images/project-education.jpg"
    },
    {
      id: "bus-delay",
      title: "NYC Bus Delay Prediction",
      category: "ml",
      tech: ["Python", "Scikit-learn", "Meteostat API", "Pandas"],
      summary: "ML model on 47K real-world NYC bus delay records with integrated weather data and feature engineering.",
      highlight: "MAE 12.3 min; 37% improvement over baseline",
      gh: "https://github.com/Sahiti-web/-nyc-bus-delay-predictor",
      details: [
        "ML model on 47K real-world NYC bus delay records with integrated weather data.",
        "Engineered features including rush hour, weather severity, and interactions.",
        "Random Forest achieved MAE 12.3 min, a 37% improvement over the baseline.",
        "Higher delays were observed during off-peak hours than rush hour in this filtered dataset."
      ],
      image: "assets/images/project-bus.jpg"
    },
    {
      id: "student-xai",
      title: "Student Performance XAI Governance Framework",
      category: "analytics",
      tech: ["Python", "ML", "XAI"],
      summary: "Explainable AI framework for student dropout prediction, using a champion Random Forest model with ~92.9% accuracy and SHAP/LIME explainability plus fairness governance checks.",
      highlight: "RF champion · 92.9% acc · 84.8% recall · 83.6% precision · F1 0.842 · AUC 0.951",
      gh: "https://github.com/TejasviKolhe193/Student-performance-XAI-governance-framework",
      details: [
        "Explainable AI framework for student dropout prediction, using a champion Random Forest model with ~92.9% accuracy and SHAP/LIME explainability plus fairness governance checks.",
        "This entry is intentionally neutral and editable to match the public project details."
      ],
      image: "assets/images/project-placeholder.jpg"
    },
    {
      id: "foodtech-analytics",
      title: "FoodTech Analytics",
      category: "analytics",
      tech: ["Python", "Pandas", "Analytics"],
      summary: "FoodTech analytics project analyzing Instacart, delivery, and restaurant data to uncover customer behavior, demand peaks, delivery performance, and actionable business recommendations.",
      highlight: "Strong repeat demand: 60% reorder rate.",
      gh: "https://github.com/Sahiti-web/foodtech-analytics",
      details: [
        "FoodTech analytics project analyzing Instacart, delivery, and restaurant data to uncover customer behavior, demand peaks, delivery performance, and actionable business recommendations.",
        "This entry is intentionally brief and neutral to match the repository title."
      ],
      image: "assets/images/project-placeholder.jpg"
    },
    {
      id: "more-soon",
      title: "More coming soon",
      category: "all",
      tech: ["GitHub"],
      summary: "Fresh ideas, experiments, and portfolio updates are on the way.",
      highlight: "Stay tuned",
      gh: "https://github.com/Sahiti-web",
      details: [
        "This placeholder card keeps the portfolio looking active while new projects are added.",
        "Visit the GitHub profile for future work, experiments and collaborative builds."
      ],
      image: "assets/images/project-placeholder.jpg",
      external: true
    }
  ],
  homeCards: [
    { title: "About", description: "Who I am and what I care about.", link: "about.html" },
    { title: "Education", description: "My learning path and coursework.", link: "education.html" },
    { title: "Skills", description: "Core engineering and ML strengths.", link: "skills.html" },
    { title: "Projects", description: "Real work, systems thinking, and ML.", link: "projects.html" },
    { title: "Experience", description: "Internships and hands-on work.", link: "experience.html" },
    { title: "Achievements", description: "Wins, recognition, and highlights.", link: "achievements.html" },
    { title: "Certificates", description: "Courses, credentials, and learning.", link: "certificates.html" },
    { title: "Contributions", description: "Leadership and community work.", link: "contributions.html" },
    { title: "Contact", description: "Let’s connect and collaborate.", link: "contact.html" }
  ],
  experiences: [
    {
      id: "maincrafts",
      role: "AI & Machine Learning Intern",
      company: "Maincrafts Technology",
      period: "20 May 2026 to 20 June 2026",
      type: "internship",
      location: "MSME-registered",
      certificateFile: "Maincrafts Certificate of Internship-77.pdf",
      isPdf: true,
      bullets: [
        "Worked on AI/ML tasks and contributed to internship projects."
      ]
    },
    {
      id: "elevate-labs",
      role: "AI & Machine Learning Intern",
      company: "Elevate Labs",
      period: "10 Nov 2025 to 25 Dec 2025",
      type: "internship",
      location: "MSME",
      award: "Awarded Best Performer",
      certificateFile: "certificate internship elevate labs.png",
      bullets: [
        "Cleaned and preprocessed datasets by handling missing values, outliers and data inconsistencies.",
        "Performed Exploratory Data Analysis using statistical and visualization techniques to extract insights.",
        "Built and implemented Linear and Logistic Regression models for predictive analysis.",
        "Analyzed model performance and optimized results through feature selection and data transformation."
      ]
    }
  ],
  certificates: [
    {
      title: "AI & Machine Learning Internship (Best Performer)",
      issuer: "Elevate Labs",
      date: "10 Nov 2025 - 25 Dec 2025",
      type: "Internship",
      file: "certificate internship elevate labs.png",
      verify: null,
      featured: true,
      category: "internship"
    },
    {
      title: "AI & Machine Learning Internship",
      issuer: "Maincrafts Technology",
      date: "20 May 2026 - 20 Jun 2026",
      type: "Internship",
      file: "Maincrafts Certificate of Internship-77.pdf",
      preview: "assets/certificates/maincrafts-internship-thumb.jpg",
      verify: null,
      featured: true,
      category: "internship"
    },
    {
      title: "Python Programming with Red Hat (AD141 - RHA) Ver. 9.0",
      issuer: "Red Hat",
      date: "22 Mar 2025",
      type: "Course",
      file: "python red hat sahiti .pdf",
      preview: "assets/certificates/red-hat-python.jpg",
      verify: "https://www.credly.com/badges/336ba2a5-a1b1-40db-a00b-aa937b20ae6f",
      credits: "32 credit hours",
      category: "course"
    },
    {
      title: "Red Hat System Administration I (RH124 - RHA) Ver. 10",
      issuer: "Red Hat",
      date: "9 Apr 2026",
      type: "Course",
      file: "red hat administration Sahiti-Chhanam.pdf",
      preview: "assets/certificates/red-hat-rh124.jpg",
      verify: "https://www.credly.com/badges/16441a93-8cf3-49e3-b596-31d8370b1294",
      credits: "40 credit hours",
      category: "course"
    },
    {
      title: "Data Structures and Algorithms using Python, Part 1",
      issuer: "Infosys Springboard",
      date: "6 Nov 2025",
      type: "Course",
      file: "springboard infosys dsa certifictae sahiti.pdf",
      preview: "assets/certificates/springboard-dsa.jpg",
      verify: "https://verify.onwingspan.com",
      category: "course"
    },
    {
      title: "Mastering Agentic AI: From Prompt to Protocols to Production",
      issuer: "Udemy",
      date: "24 Aug 2026",
      type: "Course",
      file: "agentic ai udemy sahiti.pdf",
      preview: "assets/certificates/agentic-ai-udemy.jpg",
      verify: "https://ude.my/UC-238194ba-af6a-41da-8b24-5eb92c45ac27",
      credits: "38 hours",
      category: "course",
      instructor: "Vinit Singh"
    },
    {
      title: "C and C++ Programming",
      issuer: "iTech",
      date: "Date not listed",
      type: "Course",
      file: "I tech c and c plus plus certificate .pdf",
      preview: "assets/certificates/itech-c-cpp-preview.png",
      verify: null,
      category: "course",
      duration: "4 months"
    },
    {
      title: "Cloud Computing Workshop",
      issuer: "Techfest, IIT",
      date: "22–24 December 2025",
      type: "Workshop",
      file: "sahiti iit workshop.pdf",
      preview: "assets/certificates/iit-cloud-workshop-preview.png",
      verify: null,
      category: "course"
    },

  ],
  projectResults: [
    { value: "95%", label: "at-risk district prediction accuracy" },
    { value: "12.3 min", label: "bus delay MAE · 37% better than baseline" },
    { value: "92.9%", label: "student dropout prediction accuracy" },
    { value: "60%", label: "FoodTech reorder rate" }
  ],
  medals: [
    { title: "Four medals from SportSpectra and Rival Rumble", image: "medals.jpeg", alt: "Combined photo of all four SportSpectra and Rival Rumble medals" }
  ],
  achievements: [
    {
      title: "Best Performer award",
      detail: "Elevate Labs AI/ML Internship",
      icon: "🏆",
      type: "award"
    },
    {
      title: "Four medals across SportSpectra and Rival Rumble",
      detail: "A combined photo of all four medals is included in the sports section.",
      icon: "🥇",
      type: "sports"
    },
    {
      title: "Participated in Sankalp Bharat Hackathon",
      detail: "Hackathon participation",
      icon: "🚀",
      type: "hackathon"
    },
    {
      title: "Project highlight",
      detail: "95% accuracy at-risk district model",
      icon: "📊",
      type: "project"
    },
    {
      title: "Project highlight",
      detail: "37% improvement over baseline in the bus delay model",
      icon: "📈",
      type: "project"
    }
  ],
  contributions: [
    {
      role: "Core Member",
      organization: "ACM, SIT Nagpur",
      date: "[add details]",
      story: "Helped organize multiple technical events, workshops and hackathons.",
      photo: "acm core member badge.jpeg"
    },
    {
      role: "Co-Coordinator",
      organization: "Literary Club, SIT Nagpur",
      date: "[add details]",
      story: "Organized literary and technical events, coordinated teams, managed event logistics, and promoted student engagement.",
      photo: "literary club badges.jpeg"
    },
    {
      role: "Volunteer",
      organization: "ICSIT Conference, SIT Nagpur",
      date: "",
      story: "Supported conference logistics and participation.",
      photo: "Icsit certificate .pdf"
    },
    {
      role: "Volunteer",
      organization: "Code Sprint",
      date: "",
      story: "Volunteered at Code Sprint.",
      photo: "Code sprint volunteer.pdf"
    },
    {
      role: "Participant",
      organization: "Sankalp Bharat Hackathon",
      date: "",
      story: "Participated in Sankalp Bharat 2K26. Team ID: SKB-F31.",
      photo: "assets/gallery/sankalp-bharat-website.png"
    },
    {
      role: "Participant / athlete",
      organization: "SportSpectra and Rival Rumble",
      date: "",
      story: "Competed in college sports events and earned four medals across SportSpectra and Rival Rumble.",
      photo: "assets/gallery/sports-trophy-photo.png"
    }
  ],
};

window.portfolioData = portfolioData;
