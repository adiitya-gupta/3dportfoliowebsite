import type { Project, Skill, Milestone, TeleportTarget, CarColor, PortfolioInfo } from '../types/index';

export const PORTFOLIO_DATA: PortfolioInfo = {
  name: 'ADITYA GUPTA',
  title: 'Data Scientist, ML Engineer & Full-Stack Developer',
  subtitle: 'Full-Stack Developer • AI Engineer • Automation Architect',
  bio: 'Specializing in Data Science & Machine Learning at Lovely Professional University. Building AI applications, PyTorch neural networks, Streamlit ML apps, and Google Cloud BigQuery data pipelines.',
  email: 'adityaofficial9918@gmail.com',
  phone: '+91-7355583185',
  github: 'https://github.com/adiitya-gupta',
  linkedin: 'https://linkedin.com/in/adiitya-gupta',
  twitter: 'https://twitter.com',
  education: 'Bachelor of Technology (CSE); Specialization: Data Science & Machine Learning | Lovely Professional University, Punjab (2024 – 2028)',
  school: 'P.G. Senior Secondary School (Mathematics & Computer Science)',
  resumeUrl: '#'
};

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'Desi Cozy Restaurant Analytics Platform',
    category: 'Full-Stack & Business Intelligence',
    description: 'Responsive web apps for restaurant operations, role-based admin control, reservation handling & real-time revenue dashboards.',
    fullDescription: 'Desi Cozy Restaurant Analytics Platform streamlines digital restaurant operations and customer engagement. Features a role-based admin dashboard for menu management, customer records, reservation handling, and interactive revenue analytics.',
    problem: 'Restaurant owners struggled with fragmented reservation tracking, manual menu updates, and lack of real-time operational revenue analytics.',
    solution: 'Designed two responsive web apps featuring a secure role-based admin panel, automated reservation workflow, and interactive BI dashboards.',
    contribution: 'Architected frontend web apps, role-based security access, reservation engine, and real-time revenue visualization charts.',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Dashboard Dev', 'Business Intelligence', 'REST APIs'],
    color: '#06b6d4',
    accentColor: '#38bdf8',
    demoUrl: 'https://github.com/adiitya-gupta',
    githubUrl: 'https://github.com/adiitya-gupta',
    highlights: [
      'Developed two responsive web applications for restaurant operations and digital management',
      'Designed a secure role-based admin dashboard for menu management and reservation handling',
      'Built analytical dashboards to visualize customer behavior, revenue trends, and business KPIs'
    ],
    stats: [
      { label: 'Role Access', value: 'Multi-Level' },
      { label: 'Analytics', value: 'Real-Time' },
      { label: 'UX Performance', value: '100%' }
    ]
  },
  {
    id: 'project-2',
    title: 'CIFAR-10 Image Classifier',
    category: 'Deep Learning & Computer Vision',
    description: 'PyTorch Convolutional Neural Network classifying 32x32 image datasets across 10 categories with 72.3% test accuracy.',
    fullDescription: 'Custom 3-block Convolutional Neural Network (~620K parameters) engineered in PyTorch with batch normalization, dropout regularization, and data augmentation techniques. Includes precision/recall/F1 metrics evaluation and confusion matrix visualizations using Matplotlib.',
    problem: 'Multi-class image classification requires deep architectural generalization without overfitting on small 32x32 resolutions.',
    solution: 'Engineered a 3-block CNN (~620K params) in PyTorch incorporating Batch Normalization, Dropout layers, and data augmentation.',
    contribution: 'Built neural network pipeline, data augmentation transformations, trained PyTorch model, and evaluated precision/recall/F1 metrics.',
    techStack: ['PyTorch', 'torchvision', 'Python', 'Scikit-learn', 'Matplotlib', 'CNN'],
    color: '#8b5cf6',
    accentColor: '#a78bfa',
    demoUrl: 'https://github.com/adiitya-gupta',
    githubUrl: 'https://github.com/adiitya-gupta',
    highlights: [
      '72.3% Test Accuracy on 32x32 CIFAR-10 multi-class dataset across 10 categories',
      'Designed a 3-block CNN architecture (~620K parameters) with batch normalization & dropout',
      'Evaluated model performance using precision/recall/F1 metrics & Confusion Matrix visualizations'
    ],
    stats: [
      { label: 'Test Accuracy', value: '72.3%' },
      { label: 'Parameters', value: '~620K' },
      { label: 'Framework', value: 'PyTorch' }
    ]
  },
  {
    id: 'project-3',
    title: 'Real-Time NLP Sentiment Analysis App',
    category: 'Natural Language Processing',
    description: 'Real-time NLP sentiment analysis web app with text preprocessing, tokenization, and Scikit-learn classification (>85% accuracy).',
    fullDescription: 'Built during Data Science Internship at Vorins Technologies. Features end-to-end NLP preprocessing pipeline including text cleaning, tokenization, stop-word removal, and TF-IDF vectorization. Deployed live with Streamlit.',
    problem: 'Businesses needed instant sentiment identification from raw unstructured customer reviews and social text feeds.',
    solution: 'Created an end-to-end NLP preprocessing & machine learning classification engine achieving over 85% accuracy.',
    contribution: 'Built text cleaning & TF-IDF tokenization pipeline, trained classification models, and deployed Streamlit web interface.',
    techStack: ['Python', 'Streamlit', 'NLP', 'Scikit-learn', 'TF-IDF', 'Machine Learning'],
    color: '#10b981',
    accentColor: '#34d399',
    demoUrl: 'https://github.com/adiitya-gupta',
    githubUrl: 'https://github.com/adiitya-gupta',
    highlights: [
      'Achieved over 85% prediction accuracy through feature engineering & Scikit-learn optimization',
      'Built NLP preprocessing pipelines: text cleaning, tokenization, stop-word removal & TF-IDF vectorization',
      'Deployed real-time Streamlit application for instant text sentiment prediction'
    ],
    stats: [
      { label: 'Prediction Acc', value: '>85%' },
      { label: 'Pipeline', value: 'TF-IDF' },
      { label: 'Deploy Engine', value: 'Streamlit' }
    ]
  },
  {
    id: 'project-4',
    title: 'GCP BigQuery Data Warehouse',
    category: 'Cloud Data Engineering',
    description: 'Cloud data warehouse pipelines, BigQuery analytics, and Compute Engine load-balanced deployments on Google Cloud.',
    fullDescription: 'Engineered Google Cloud Platform infrastructure featuring BigQuery data warehouses, Compute Engine load balancing, and ML API integrations for high-availability cloud analytics.',
    problem: 'Handling large-scale data analytics requires reliable cloud data warehousing and load-balanced cloud infrastructure.',
    solution: 'Designed Google Cloud BigQuery data warehouses, load-balanced Compute Engine clusters, and GCP Machine Learning API pipelines.',
    contribution: 'Earned 4 Certified Google Cloud Skill Badges for BigQuery, ML APIs, Website Building, and Compute Engine Load Balancing.',
    techStack: ['GCP', 'BigQuery', 'Compute Engine', 'SQL', 'Python', 'ML APIs'],
    color: '#f59e0b',
    accentColor: '#fbbf24',
    demoUrl: 'https://github.com/adiitya-gupta',
    githubUrl: 'https://github.com/adiitya-gupta',
    highlights: [
      'Earned 4 Certified Google Cloud Skill Badges in BigQuery, ML APIs & Load Balancing',
      'Architected cloud data warehouses with automated SQL analytics pipelines',
      'Implemented high-availability Compute Engine server deployments'
    ],
    stats: [
      { label: 'GCP Badges', value: '4 Certified' },
      { label: 'Platform', value: 'Google Cloud' },
      { label: 'Uptime', value: '99.9%' }
    ]
  }
];

export const SKILLS: Skill[] = [
  { id: 'skill-1', name: 'Python', category: 'Backend & ML', color: '#3776ab', icon: 'Code', experienceDuration: '2+ Years Experience', level: 95 },
  { id: 'skill-2', name: 'PyTorch & TF', category: 'Data Science & AI', color: '#ee4c2c', icon: 'Cpu', experienceDuration: '15+ Neural Models Trained', level: 92 },
  { id: 'skill-3', name: 'Machine Learning', category: 'Data Science & AI', color: '#8b5cf6', icon: 'Activity', experienceDuration: '20+ ML Pipelines Built', level: 94 },
  { id: 'skill-4', name: 'Scikit-learn', category: 'Data Science & AI', color: '#f7931e', icon: 'Layers', experienceDuration: '10+ Classification Apps', level: 90 },
  { id: 'skill-5', name: 'GCP & BigQuery', category: 'Cloud & DB', color: '#4285f4', icon: 'Server', experienceDuration: '4 Certified Skill Badges', level: 88 },
  { id: 'skill-6', name: 'SQL & Pandas', category: 'Cloud & DB', color: '#336791', icon: 'FileCode', experienceDuration: '2+ Years Query Engineering', level: 92 },
  { id: 'skill-7', name: 'Streamlit NLP', category: 'Frontend & Tools', color: '#ff4b4b', icon: 'Terminal', experienceDuration: 'Real-Time App Deployed', level: 88 },
  { id: 'skill-8', name: 'JavaScript & HTML', category: 'Frontend & Tools', color: '#f7df1e', icon: 'Code', experienceDuration: 'Full-Stack Apps Built', level: 90 },
  { id: 'skill-9', name: 'Data Analytics', category: 'Data Science & AI', color: '#10b981', icon: 'Activity', experienceDuration: 'Financial & CRM Insights', level: 92 },
  { id: 'skill-10', name: 'Matplotlib/Seaborn', category: 'Data Science & AI', color: '#1565c0', icon: 'Palette', experienceDuration: 'Custom Data Visualizations', level: 90 },
  { id: 'skill-11', name: 'REST APIs & Git', category: 'Frontend & Tools', color: '#f05032', icon: 'GitBranch', experienceDuration: 'Production Code Workflow', level: 88 },
  { id: 'skill-12', name: 'Compute Engine', category: 'Cloud & DB', color: '#34a853', icon: 'Container', experienceDuration: 'Load-Balanced Clusters', level: 85 }
];

export const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    year: 'Jun 2026 – Present',
    role: 'Financial Analyst Intern',
    organization: 'Wintern Whiz',
    description: 'Analyzed financial datasets to identify business trends, supporting strategic decision-making. Prepared KPI reports and quantitative analysis to improve reporting accuracy.',
    skills: ['Financial Analytics', 'SQL', 'Python', 'KPI Reporting']
  },
  {
    id: 'm2',
    year: 'May 2026 – Present',
    role: 'Ambassador Intern (Analytics & Reporting)',
    organization: 'Emversity',
    description: 'Managed CRM datasets ensuring high data accuracy, consistency, and integrity across reporting systems. Generated performance reports & analytical operational insights.',
    skills: ['CRM Analytics', 'Data Wrangling', 'Operational Insights']
  },
  {
    id: 'm3',
    year: 'Sep 2024 – Oct 2024',
    role: 'Data Science Intern',
    organization: 'Vorins Technologies',
    description: 'Developed a real-time Sentiment Analysis application using Python, Streamlit & Machine Learning algorithms. Built NLP preprocessing pipelines achieving over 85% prediction accuracy.',
    skills: ['Python', 'Streamlit', 'NLP', 'Scikit-learn', 'TF-IDF']
  },
  {
    id: 'm4',
    year: '2024 – 2028',
    role: 'B.Tech CSE - Specialization: Data Science & ML',
    organization: 'Lovely Professional University',
    description: 'Specializing in Data Science, Machine Learning, Deep Learning, Data Analytics, Cloud Systems, and Software Engineering.',
    skills: ['Machine Learning', 'Deep Learning', 'GCP', 'Data Analytics']
  }
];

export const CERTIFICATIONS = [
  'Build a Data Warehouse with BigQuery | Google Cloud Skill Badge',
  'Machine Learning APIs on Google Cloud | Google Cloud Skill Badge',
  'Build a Website on Google Cloud | Google Cloud Skill Badge',
  'Implement Load Balancing on Compute Engine | Google Cloud Skill Badge'
];

export const TELEPORT_TARGETS: TeleportTarget[] = [
  { id: 'spawn', label: 'Start Plaza', iconName: 'Home', position: [0, 0.5, 5], rotationY: 0 },
  { id: 'about', label: 'About & Resume', iconName: 'User', position: [-90, 0.5, 0], rotationY: Math.PI / 2 },
  { id: 'projects', label: 'Projects District', iconName: 'Briefcase', position: [-100, 0.5, -80], rotationY: 0 },
  { id: 'skills', label: 'Skills Arena', iconName: 'Boxes', position: [100, 0.5, -80], rotationY: 0 },
  { id: 'experience', label: 'Internships', iconName: 'Milestone', position: [-100, 0.5, 60], rotationY: Math.PI },
  { id: 'contact', label: 'Contact Station', iconName: 'Mail', position: [100, 0.5, 100], rotationY: -Math.PI * 0.75 },
  { id: 'playground', label: 'Playground & Stunts', iconName: 'Gamepad2', position: [0, 0.5, -140], rotationY: Math.PI }
];

export const CAR_COLORS: CarColor[] = [
  { name: 'Neon Cyber Cyan', hex: 0x00f3ff, css: '#00f3ff' },
  { name: 'Sunset Crimson', hex: 0xff2a5f, css: '#ff2a5f' },
  { name: 'Electric Violet', hex: 0x8b5cf6, css: '#8b5cf6' },
  { name: 'Hyper Orange', hex: 0xff6b00, css: '#ff6b00' },
  { name: 'Emerald Nitro', hex: 0x10b981, css: '#10b981' },
  { name: 'Obsidian Black', hex: 0x111827, css: '#111827' }
];
