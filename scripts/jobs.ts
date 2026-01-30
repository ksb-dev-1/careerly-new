import {
  Currency,
  JobMode,
  JobStatus,
  JobType,
  Category,
} from "@/generated/prisma/client";

export const placeholderJobs = [
  // 1
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Adobe",
    companyName: "Adobe",
    experience: "2-4",
    role: "UI/UX Designer",
    jobType: JobType.FULL_TIME,
    location: "Bangalore, India",
    jobMode: JobMode.REMOTE,
    salary: 1200000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["figma", "ux design", "wireframing", "prototyping"],
    openings: 1,
    isFeatured: false,
    category: Category.UI_UX_DESIGN,
    description: `
#### About the Role
As a UI/UX Designer, you will shape intuitive and visually engaging user experiences for Adobe’s creative products used by millions worldwide.

#### Responsibilities
- Design user interfaces and user flows
- Create wireframes, prototypes, and design systems
- Conduct usability testing and iterate on feedback
- Collaborate closely with product and engineering teams

#### Requirements
- 2–4 years of UI/UX design experience
- Strong proficiency with Figma
- Solid understanding of user-centered design principles
- A strong design portfolio

#### Why Join Us
- Design products used by global creators
- Collaborative and design-driven culture
- Strong focus on innovation and creativity
`,
  },

  // 2
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Neilsen",
    companyName: "Nielsen",
    experience: "1-2",
    role: "User Research Analyst",
    jobType: JobType.FULL_TIME,
    location: "Pune, India",
    jobMode: JobMode.ONSITE,
    salary: 900000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["user research", "interviews", "survey design", "analysis"],
    openings: 2,
    isFeatured: false,
    category: Category.HUMAN_RESEARCH,
    description: `
#### About the Role
We are seeking a User Research Analyst to generate actionable insights through qualitative and quantitative research methods.

#### Responsibilities
- Conduct user interviews and surveys
- Analyze behavioral data and research findings
- Translate insights into clear recommendations
- Work with UX and product teams

#### Requirements
- 1–3 years of research or analytics experience
- Strong analytical and communication skills
- Experience with research methodologies

#### Why Join Us
- Work with data-driven decision making
- Influence product and user experience strategy
`,
  },

  // 3
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Hubspot",
    companyName: "HubSpot",
    experience: "2-5",
    role: "Digital Marketing Specialist",
    jobType: JobType.FULL_TIME,
    location: "Mumbai, India",
    jobMode: JobMode.ONSITE,
    salary: 1000000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["seo", "google ads", "content marketing", "analytics"],
    openings: 1,
    isFeatured: false,
    category: Category.DIGITAL_MARKETING,
    description: `
#### About the Role
You will plan and execute digital marketing strategies to drive growth, engagement, and brand visibility.

#### Responsibilities
- Manage SEO and paid advertising campaigns
- Create and optimize content for digital channels
- Analyze campaign performance using analytics tools
- Collaborate with content and sales teams

#### Requirements
- 2–5 years of digital marketing experience
- Hands-on experience with SEO and Google Ads
- Strong analytical mindset

#### Why Join Us
- High-impact marketing ownership
- Data-driven and collaborative culture
`,
  },

  // 4
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Netflix",
    companyName: "Netflix",
    experience: "3-6",
    role: "Motion Graphics Designer",
    jobType: JobType.FULL_TIME,
    location: "Hyderabad, India",
    jobMode: JobMode.ONSITE,
    salary: 1400000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["after effects", "motion design", "video editing"],
    openings: 1,
    isFeatured: false,
    category: Category.VIDEO_AND_ANIMATION,
    description: `
#### About the Role
We are looking for a Motion Graphics Designer to create engaging visuals that support Netflix’s global storytelling.

#### Responsibilities
- Design motion graphics and animations
- Collaborate with creative and marketing teams
- Maintain visual consistency across projects
- Deliver high-quality video assets

#### Requirements
- 3–6 years of motion design experience
- Expertise in After Effects and video tools
- Strong creative portfolio

#### Why Join Us
- Work on globally recognized content
- Creative freedom and ownership
`,
  },

  // 5
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Google",
    companyName: "Google",
    experience: "3-5",
    role: "Frontend Engineer",
    jobType: JobType.FULL_TIME,
    location: "San Francisco, USA",
    jobMode: JobMode.HYBRID,
    salary: 135000,
    currency: Currency.USD,
    jobStatus: JobStatus.OPEN,
    skills: ["react.js", "typescript", "accessibility"],
    openings: 3,
    isFeatured: false,
    category: Category.DEVELOPMENT,
    description: `
#### About the Role
As a Frontend Engineer, you will build performant and accessible web applications used by millions.

#### Responsibilities
- Develop scalable frontend features
- Improve accessibility and performance
- Collaborate with design and backend teams
- Write clean and maintainable code

#### Requirements
- 3–5 years frontend experience
- Strong React and TypeScript skills
- Knowledge of web accessibility standards

#### Why Join Us
- Global product impact
- World-class engineering culture
`,
  },

  // 6
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Amazon",
    companyName: "Amazon",
    experience: "4-7",
    role: "Backend Engineer",
    jobType: JobType.FULL_TIME,
    location: "Bangalore, India",
    jobMode: JobMode.HYBRID,
    salary: 3200000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["node.js", "aws", "microservices", "postgresql"],
    openings: 5,
    isFeatured: true,
    category: Category.DEVELOPMENT,
    description: `
#### About the Role
Join Amazon's backend team to design highly scalable and fault-tolerant systems.

#### Responsibilities
- Design REST and event-driven services
- Build scalable microservices
- Optimize database performance
- Ensure system reliability

#### Requirements
- 4–7 years backend experience
- Strong Node.js and AWS knowledge
- Experience with distributed systems

#### Why Join Us
- High-scale systems
- Strong ownership culture
- Career growth opportunities
`,
  },

  // 7
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Microsoft",
    companyName: "Microsoft",
    experience: "2-4",
    role: "Full Stack Developer",
    jobType: JobType.FULL_TIME,
    location: "Hyderabad, India",
    jobMode: JobMode.REMOTE,
    salary: 2400000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["react", "node.js", "azure", "sql"],
    openings: 4,
    isFeatured: false,
    category: Category.DEVELOPMENT,
    description: `
#### About the Role
Work across frontend and backend systems powering Microsoft cloud products.

#### Responsibilities
- Build full-stack features
- Collaborate across teams
- Write clean and testable code
- Improve system scalability

#### Requirements
- 2–4 years experience
- Full stack development skills
- Cloud platform exposure preferred

#### Why Join Us
- Flexible work culture
- Learning-focused environment
`,
  },

  // 8
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Netflix",
    companyName: "Netflix",
    experience: "5-8",
    role: "Senior Software Engineer",
    jobType: JobType.FULL_TIME,
    location: "Los Gatos, USA",
    jobMode: JobMode.REMOTE,
    salary: 180000,
    currency: Currency.USD,
    jobStatus: JobStatus.OPEN,
    skills: ["java", "spring boot", "distributed systems"],
    openings: 2,
    isFeatured: false,
    category: Category.DEVELOPMENT,
    description: `
#### About the Role
Help build highly reliable backend systems that serve millions of Netflix users.

#### Responsibilities
- Design distributed systems
- Improve system performance
- Lead technical initiatives
- Mentor engineers

#### Requirements
- 5–8 years experience
- Strong Java and system design skills
- Experience with high-scale platforms

#### Why Join Us
- Freedom and responsibility culture
- Top-of-market compensation
`,
  },

  // 9
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Startup",
    companyName: "TechNova",
    experience: "1-3",
    role: "Junior Software Developer",
    jobType: JobType.INTERNSHIP,
    location: "Pune, India",
    jobMode: JobMode.ONSITE,
    salary: 120000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["javascript", "react", "git"],
    openings: 6,
    isFeatured: false,
    category: Category.DEVELOPMENT,
    description: `
#### About the Role
Perfect opportunity for early-career developers to work on real-world products.

#### Responsibilities
- Implement frontend features
- Fix bugs and improve UI
- Learn best practices
- Work closely with senior engineers

#### Requirements
- 1–3 years experience
- Good JavaScript fundamentals
- Willingness to learn

#### Why Join Us
- Startup exposure
- Fast learning curve
- Supportive team
`,
  },

  // 10
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Spotify",
    companyName: "Spotify",
    experience: "1-3",
    role: "Audio Content Specialist",
    jobType: JobType.INTERNSHIP,
    location: "Mumbai, India",
    jobMode: JobMode.REMOTE,
    salary: 80000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["audio editing", "content curation", "sound design"],
    openings: 2,
    isFeatured: false,
    category: Category.MUSIC_AND_AUDIO,
    description: `
#### About the Role
You will manage and curate audio content to deliver high-quality listening experiences to users.

#### Responsibilities
- Edit and review audio content
- Curate playlists and audio collections
- Ensure audio quality and consistency
- Collaborate with content teams

#### Requirements
- Experience in audio editing or sound design
- Strong attention to detail
- Passion for music and audio content

#### Why Join Us
- Influence global audio experiences
- Creative and collaborative culture
`,
  },

  // 11
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Sap",
    companyName: "SAP",
    experience: "4-6",
    role: "Machine Learning Engineer",
    jobType: JobType.FULL_TIME,
    location: "Berlin, Germany",
    jobMode: JobMode.ONSITE,
    salary: 85000,
    currency: Currency.EUR,
    jobStatus: JobStatus.OPEN,
    skills: ["python", "ml", "tensorflow", "data pipelines"],
    openings: 2,
    isFeatured: true,
    category: Category.AI_SERVICES,
    description: `
#### About the Role
You will develop enterprise-grade machine learning solutions to solve complex business problems.

#### Responsibilities
- Build and deploy ML pipelines
- Work with structured and unstructured data
- Collaborate with cross-functional teams
- Optimize model accuracy and performance

#### Requirements
- 4–6 years ML experience
- Strong Python and ML frameworks knowledge
- Experience with production ML systems

#### Why Join Us
- Large-scale enterprise impact
- Strong focus on innovation
`,
  },

  // 12
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Booking",
    companyName: "Booking.com",
    experience: "2-5",
    role: "Product Designer",
    jobType: JobType.FULL_TIME,
    location: "Amsterdam, Netherlands",
    jobMode: JobMode.REMOTE,
    salary: 70000,
    currency: Currency.EUR,
    jobStatus: JobStatus.OPEN,
    skills: ["figma", "design systems", "usability testing"],
    openings: 1,
    isFeatured: false,
    category: Category.UI_UX_DESIGN,
    description: `
#### About the Role
Design seamless and intuitive experiences that help millions of users book travel effortlessly.

#### Responsibilities
- Design user flows and interfaces
- Conduct usability testing
- Collaborate with engineers and PMs
- Maintain design systems

#### Requirements
- 2–5 years product design experience
- Strong Figma skills
- User-focused design mindset

#### Why Join Us
- Global user base
- Design-led product culture
`,
  },

  // 13
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Openai",
    companyName: "OpenAI Labs",
    experience: "3-5",
    role: "AI Engineer",
    jobType: JobType.FULL_TIME,
    location: "Bangalore, India",
    jobMode: JobMode.ONSITE,
    salary: 2000000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["python", "machine learning", "llms", "pytorch"],
    openings: 2,
    isFeatured: false,
    category: Category.AI_SERVICES,
    description: `
#### About the Role
We are seeking an AI Engineer to develop and deploy machine learning models that power intelligent systems.

#### Responsibilities
- Build and train ML models
- Work with large datasets and LLMs
- Optimize model performance and reliability
- Collaborate with research and product teams

#### Requirements
- 3–5 years of ML or AI experience
- Strong Python and deep learning knowledge
- Experience with PyTorch or similar frameworks

#### Why Join Us
- Work on cutting-edge AI research
- High-impact and fast-paced environment
`,
  },

  // 14
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Deloitte",
    companyName: "Deloitte",
    experience: "2-4",
    role: "Business Analyst",
    jobType: JobType.FULL_TIME,
    location: "Gurgaon, India",
    jobMode: JobMode.HYBRID,
    salary: 1100000,
    currency: Currency.INR,
    jobStatus: JobStatus.OPEN,
    skills: ["business analysis", "sql", "excel", "stakeholder management"],
    openings: 3,
    isFeatured: false,
    category: Category.AI_SERVICES,
    description: `
#### About the Role
As a Business Analyst, you will help organizations make informed decisions through data and process analysis.

#### Responsibilities
- Gather and document business requirements
- Analyze datasets and create reports
- Work with stakeholders to define solutions
- Support data-driven decision making

#### Requirements
- 2–4 years of business analysis experience
- Strong SQL and Excel skills
- Excellent communication skills

#### Why Join Us
- Exposure to diverse industries
- Strong learning and career growth paths
`,
  },

  // 15
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Shopify",
    companyName: "Shopify",
    experience: "2-4",
    role: "Growth Marketing Manager",
    jobType: JobType.FULL_TIME,
    location: "New York, USA",
    jobMode: JobMode.REMOTE,
    salary: 95000,
    currency: Currency.USD,
    jobStatus: JobStatus.OPEN,
    skills: ["growth marketing", "seo", "email marketing"],
    openings: 1,
    isFeatured: false,
    category: Category.DIGITAL_MARKETING,
    description: `
#### About the Role
Drive growth through experimentation, analytics, and performance marketing strategies.

#### Responsibilities
- Optimize acquisition funnels
- Run growth experiments
- Analyze marketing performance
- Collaborate with product teams

#### Requirements
- Growth or performance marketing experience
- Strong analytical skills
- Experience with SEO and email marketing

#### Why Join Us
- High ownership role
- Startup-like growth mindset
`,
  },

  // 16
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Amazon",
    companyName: "Amazon",
    experience: "3-6",
    role: "Business Intelligence Analyst",
    jobType: JobType.FULL_TIME,
    location: "Toronto, Canada",
    jobMode: JobMode.HYBRID,
    salary: 110000,
    currency: Currency.USD,
    jobStatus: JobStatus.OPEN,
    skills: ["sql", "dashboards", "data modeling"],
    openings: 2,
    isFeatured: false,
    category: Category.BUSINESS_ANALYSIS,
    description: `
#### About the Role
Enable data-driven decisions by building insights and dashboards for business teams.

#### Responsibilities
- Design dashboards and reports
- Analyze business metrics
- Work with large datasets
- Support leadership decision making

#### Requirements
- Strong SQL skills
- Experience with BI tools
- Analytical thinking

#### Why Join Us
- Massive scale and impact
- Data-first culture
`,
  },

  // 17
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=McKinsey",
    companyName: "McKinsey & Company",
    experience: "2-5",
    role: "Management Consultant",
    jobType: JobType.FULL_TIME,
    location: "Munich, Germany",
    jobMode: JobMode.ONSITE,
    salary: 90000,
    currency: Currency.EUR,
    jobStatus: JobStatus.OPEN,
    skills: ["strategy", "problem solving", "presentation"],
    openings: 3,
    isFeatured: false,
    category: Category.CONSULTING,
    description: `
#### About the Role
Help global organizations solve complex strategic and operational challenges.

#### Responsibilities
- Analyze business problems
- Develop strategic recommendations
- Work directly with clients
- Present insights to leadership

#### Requirements
- Strong problem-solving skills
- Excellent communication
- Consulting or analytics background

#### Why Join Us
- Prestigious global exposure
- Accelerated career growth
`,
  },

  // 18
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Zendesk",
    companyName: "Zendesk",
    experience: "1-3",
    role: "Customer Support Specialist",
    jobType: JobType.FULL_TIME,
    location: "Austin, USA",
    jobMode: JobMode.ONSITE,
    salary: 65000,
    currency: Currency.USD,
    jobStatus: JobStatus.OPEN,
    skills: ["customer support", "crm", "communication"],
    openings: 4,
    isFeatured: false,
    category: Category.CUSTOMER_SUPPORT,
    description: `
#### About the Role
Deliver exceptional customer support experiences across digital channels.

#### Responsibilities
- Handle customer inquiries via chat and email
- Resolve technical and account issues
- Maintain high satisfaction scores
- Collaborate with internal teams

#### Requirements
- Strong communication skills
- Customer-first mindset
- Experience with CRM tools

#### Why Join Us
- Customer-centric culture
- Remote-friendly environment
`,
  },

  // 19
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Ubisoft",
    companyName: "Ubisoft",
    experience: "3-5",
    role: "3D Animation Artist",
    jobType: JobType.FULL_TIME,
    location: "Paris, France",
    jobMode: JobMode.HYBRID,
    salary: 68000,
    currency: Currency.EUR,
    jobStatus: JobStatus.OPEN,
    skills: ["3d animation", "maya", "blender"],
    openings: 2,
    isFeatured: false,
    category: Category.VIDEO_AND_ANIMATION,
    description: `
#### About the Role
Create immersive and realistic animations for AAA video game titles.

#### Responsibilities
- Design high-quality 3D animations
- Collaborate with game designers
- Ensure animation quality and consistency
- Meet production deadlines

#### Requirements
- Strong experience with Maya or Blender
- Solid animation portfolio
- Passion for gaming

#### Why Join Us
- Work on globally loved games
- Creative and collaborative teams
`,
  },
];
