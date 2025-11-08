// Mapping of skills to learning resources
export const skillResources = {
  // Core Web Development
  "HTML": "https://developer.mozilla.org/en-US/docs/Learn/HTML",
  "CSS": "https://developer.mozilla.org/en-US/docs/Learn/CSS",
  "JavaScript": "https://roadmap.sh/javascript",
  "ReactJS": "https://react.dev/learn",
  "React": "https://react.dev/learn",
  "Node.js": "https://nodejs.org/en/docs",
  "TypeScript": "https://www.typescriptlang.org/docs/",
  
  // Programming Languages
  "Java": "https://roadmap.sh/java",
  "Python": "https://docs.python.org/3/tutorial/",
  "C++": "https://cplusplus.com/doc/tutorial/",
  "Kotlin": "https://kotlinlang.org/docs/home.html",
  "Swift": "https://developer.apple.com/swift/",
  
  // Data Structures & Algorithms
  "Data Structures": "https://www.geeksforgeeks.org/data-structures/",
  
  // Data Science & Analytics
  "Data Analysis": "https://www.kaggle.com/learn/data-analysis",
  "Statistics": "https://www.khanacademy.org/math/statistics-probability",
  "Data Visualization": "https://www.freecodecamp.org/learn/data-visualization/",
  
  // AI & Machine Learning
  "Machine Learning": "https://roadmap.sh/ai-data-scientist",
  "Deep Learning": "https://www.tensorflow.org/learn",
  "Natural Language Processing": "https://www.coursera.org/learn/natural-language-processing",
  "MLOps": "https://mlops.community/",
  
  // Cloud & DevOps
  "AWS": "https://aws.amazon.com/training/",
  "AWS Cloud": "https://aws.amazon.com/training/",
  "Docker": "https://docs.docker.com/get-started/",
  "Kubernetes": "https://kubernetes.io/docs/tutorials/",
  "CI/CD": "https://roadmap.sh/devops",
  "Linux Administration": "https://linuxjourney.com/",
  
  // Mobile Development
  "Flutter": "https://flutter.dev/docs",
  
  // Marketing
  "SEO": "https://moz.com/learn/seo/what-is-seo",
  "Google Ads": "https://skillshop.exceedlms.com/student/path/18145-google-ads-search-certification",
  "Email Marketing": "https://mailchimp.com/resources/email-marketing-field-guide/",
  "Analytics": "https://analytics.google.com/analytics/academy/",
  
  // Design
  "Wireframing": "https://www.interaction-design.org/literature/topics/wireframing",
  "Prototyping": "https://www.figma.com/resources/learn-design/",
  "User Research": "https://uxdesign.cc/user-research-the-ultimate-guide-8f1a97360d7f",
  "Figma": "https://www.figma.com/design-community/education/",
  "UI/UX Design": "https://roadmap.sh/ux-design",
  
  // Security
  "Network Security": "https://www.coursera.org/specializations/it-security",
  "Ethical Hacking": "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/",
  "Penetration Testing": "https://www.offsec.com/courses/pen-200/",
  "Cryptography": "https://crypto.stanford.edu/~dabo/courses/OnlineCrypto/",
  
  // Database
  "SQL": "https://www.freecodecamp.org/learn/relational-database/",
  "MongoDB": "https://www.mongodb.com/docs/",
  "PostgreSQL": "https://www.postgresql.org/docs/",
  
  // Version Control
  "Git": "https://git-scm.com/doc",
  
  // Additional common skills
  "Vue.js": "https://vuejs.org/guide/introduction.html",
  "Angular": "https://angular.io/docs",
  "Express.js": "https://expressjs.com/",
  "Next.js": "https://nextjs.org/learn",
  "Tailwind CSS": "https://tailwindcss.com/docs",
  "Redux": "https://redux.js.org/introduction/getting-started",
  "Webpack": "https://webpack.js.org/guides/getting-started/",
  "Jest": "https://jestjs.io/docs/getting-started",
  "Cypress": "https://www.cypress.io/",
  "TensorFlow": "https://www.tensorflow.org/learn",
  "PyTorch": "https://pytorch.org/tutorials/",
  "Azure": "https://learn.microsoft.com/en-us/azure/",
  "Google Cloud": "https://cloud.google.com/training",
  "Firebase": "https://firebase.google.com/docs/guides",
  "Adobe XD": "https://www.adobe.com/products/xd/learn/get-started.html",
  "Sketch": "https://www.sketch.com/learn/",
  "GraphQL": "https://graphql.org/learn/",
  "REST API": "https://restfulapi.net/",
};

// Function to get learning resource URL for a skill
export const getSkillResourceUrl = (skillName) => {
  // Try exact match first
  if (skillResources[skillName]) {
    return skillResources[skillName];
  }
  
  // Try case-insensitive match
  const normalizedName = skillName.toLowerCase();
  for (const [key, value] of Object.entries(skillResources)) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }
  
  // Try partial match (e.g., "JS" matches "JavaScript")
  const partialMatch = Object.keys(skillResources).find(key => 
    key.toLowerCase().includes(normalizedName) || 
    normalizedName.includes(key.toLowerCase())
  );
  
  if (partialMatch) {
    return skillResources[partialMatch];
  }
  
  // Default fallback - search on freeCodeCamp
  return `https://www.freecodecamp.org/learn/?search=${encodeURIComponent(skillName)}`;
};
