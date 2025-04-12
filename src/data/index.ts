import { Experience, Project, Education, Achievement, Research } from '../types';

export const experienceData: Experience[] = [
  {
    title: "AMADEUS | Software Development Engineer Intern",
    period: "Jan 2025 – Present | Bangalore, India",
    points: [
      "Developed a secure Browser extension with Admin portal enabling customized feedback collection for specific applications and user groups, capable of 20K+ daily interactions with ServiceNow/JIRA integration.",
      "Engineered a fine-tuned LLM pipeline that analyzes feedback sentiment and auto-generates concise action items, reducing insight generation time by 65% while improving categorization accuracy to 90%.",
      "Implemented an intelligent routing system with role-based workflows, resulting in faster issue resolution and automated assignment across departments."
    ],
    isActive: true
  },
  {
    title: "TECHCURATORS | Technical Project Associate Intern",
    period: "Feb 2024 – Jan 2025 | Bangalore, India",
    points: [
      "Engineered ContextFusion RAG framework integrating BM25, TF-IDF/Word2Vec, and Sentence-BERT embeddings, improving retrieval accuracy by 85%.",
      "Developed multi-model question generation platform using GPT-3.5/4 and custom fine-tuned PyTorch models, deploying via AWS to serve 200+ daily users across departments.",
      "Built AI-driven tools to boost team productivity with Python, FastAPI, Docker containers, increasing team velocity by 70%."
    ],
    isActive: false
  },
  {
    title: "AVAINTERN | Software Engineer Intern",
    period: "Oct 2023 – Jan 2024 | Remote",
    points: [
      "Architected Full-Stack Applications using the MERN stack and AWS, implementing advanced caching strategies that reduced cold-start latency by 60% while supporting 10,000+ concurrent users.",
      "Engineered query denormalization and compound indexing for databases within an AWS-backed environment, optimizing data access for 10K+ daily transactions and reducing read costs by 95%.",
      "Developed a fully automated CI/CD pipeline with canary deployments, distributed tracing, and automated rollbacks on AWS, slashing deployment failures by 85%."
    ],
    isActive: false
  }
];

export const projectsData: Project[] = [
{
    title: "CODESENSE AI - AI-POWERED TECHNICAL INTERVIEW PLATFORM",
    image: "https://ibb.co/6RKRF0Gj",
    link: "https://github.com/Rohit-Yadav-47/Interview-Prep-AI",
    tech: ["React", "TypeScript", "TailwindCSS", "Redux", "AI Models", "Monaco Editor"],
    points: [
      "Developed an advanced technical interview platform that simulates real-world coding interviews with AI-powered conversation and assessment",
      "Implemented voice-enabled interface, real-time Monaco code editor, and interactive React playground for comprehensive interview preparation",
      "Built custom code evaluation engine that provides detailed feedback on solution correctness, complexity, and quality"
    ],
    stars: 1,
    forks: 0
  },
  
  {
    title: "WebMind AI Assistant",
    image: "https://i.ibb.co/Q3pVyd4L/420614601-f3ba8a3d-b74e-4353-9ed9-991f64b61ffa.png",
    link: "https://github.com/Rohit-Yadav-47/WebMind-AI-Assistant",
    tech: ["JavaScript", "Chrome API", "AI Models"], 
    points: [
    "Built a Chrome extension that integrates multiple AI models (Llama 3, Mixtral, Gemma 2, DeepSeek) for different tasks",
    "Implemented a universal search bar, highlight text explanation, one-click page analysis, conversation mode, and clean code snippets",
    "Enabled voice commands and text-to-speech for hands-free use"
    ],
    stars: 0, 
    forks: 0 
    },

  {
    title: "GOOGLE CALENDAR CHROME EXTENSION",
    image: "https://i.ibb.co/fY2td4s5/418187453-f2fe4508-45eb-4b9e-bb73-c6606acbe210.jpg",
    link: "https://github.com/Rohit-Yadav-47/Smart-Daily-Planner",
    tech: ["JavaScript", "Chrome API", "React", "NLP"],
    points: [
      "Engineered a feature-rich productivity extension integrating AI-powered natural language event creation, optimized schedule generation, and Google Calendar integration.",
      "Implemented data-driven productivity insights via custom website usage tracking and intelligent website blocking."
    ],
    stars: 127,
    forks: 34
  },
  {
    title: "EVENT HUB: AI-DRIVEN EVENT MANAGEMENT",
    image: "https://github.com/user-attachments/assets/b38571fc-0d38-457e-9cef-b57bdd7e3526",
    link: "https://github.com/Rohit-Yadav-47/Event-Hub",
    tech: ["TypeScript", "FastAPI", "Elasticsearch", "Docker", "RAG"],
    points: [
      "Architected a high-performance RAG system achieving sub-50ms query latency through optimized vector embeddings and Elasticsearch integration.",
      "Developed a containerized microservice architecture with React (TypeScript) frontend and FastAPI backend, enabling seamless horizontal scaling."
    ],
    stars: 89,
    forks: 23
  },
  {
    title: "SMART WHEELCHAIR WITH AAC & HOME AUTOMATION",
    image: "https://images.unsplash.com/photo-1576834975222-9eb8c55d6e37?q=80&w=800&auto=format",
    tech: ["React", "TensorFlow", "OpenCV", "Arduino", "MQTT"],
    points: [
      "Engineered a multimodal accessibility system combining voice, biosignal, and eye-tracking interfaces to control computer functions and home appliances using TensorFlow and OpenCV.",
      "Developed an intuitive React-based GUI with customizable dashboards and MQTT/WebSocket protocols enabling seamless device control."
    ],
    stars: 43,
    forks: 15
  },
];

export const educationData: Education[] = [
  {
    institution: "VEL TECH UNIVERSITY",
    degree: "B.Tech in Computer Science and Engineering",
    period: "2021 - 2025 | Chennai, India",
    score: "CGPA: 8.9 / 10.0"
  },
  {
    institution: "NAVY CHILDREN SCHOOL",
    degree: "12th Grade, CBSE",
    period: "2021",
    score: "Percentage: 95%"
  }
];

export const achievementsData: Achievement[] = [
  {
    title: "IEEEXtreme",
    description: "Ranked 18th nationally and 151st globally among 17,000+ coders"
  },
  {
    title: "CodingNinja",
    description: "1st place in Weekly Contest #102 with consistent top-50 rank"
  },
  {
    title: "GDSC CP Lead",
    description: "Mentored 500+ students in competitive programming"
  },
  {
    title: "Hackathon Wins",
    description: "Led teams to 10+ top finishes through rapid prototyping"
  },
  {
    title: "DSA",
    description: "Solved 1000+ problems across major platforms"
  }
];

export const researchData: Research[] = [
  {
    title: "Smart Helmet with Crash and Wear Detection",
    publisher: "Springer Publication",
    link:"https://link.springer.com/chapter/10.1007/978-981-97-0892-5_56"
  },
  {
    title: "ThresholdedReLU Orthogonal Layer CNN",
    publisher: "IEEE Publication",
    link:"https://ieeexplore.ieee.org/document/10101003"
  }
];

export const skillsData = {
  programming: ["Python", "JavaScript", "TypeScript", "Bash", "Java", "C++", "C", "Flutter"],
  frameworks: ["React.js", "Redux", "Node.js", "Express.js", "FastAPI", "Django"],
  cloudDevOps: ["AWS", "Docker", "Kubernetes", "CI/CD", "PostgreSQL", "MongoDB", "Redis", "Neo4j", "MySQL"],
  machineLearning: ["TensorFlow", "PyTorch", "LLM", "RAG", "CV"]
};
