import { openai } from "./openai";
import {
  SYSTEM_PROMPT,
  ATS_SCORE_PROMPT,
  KEYWORD_MATCH_PROMPT,
  FORMATTING_ANALYSIS_PROMPT,
  RESUME_REWRITE_PROMPT,
  INTERVIEW_READINESS_PROMPT,
  fillPromptTemplate,
} from "./prompts";

export interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  grammarScore: number;
  formattingScore: number;
  keywordScore: number;
  interviewReadiness: number;

  matchedKeywords: string[];
  missingKeywords: string[];

  strengths: string[];
  weaknesses: string[];

  suggestions: {
    category: string;
    priority: "high" | "medium" | "low";
    suggestion: string;
    example?: string;
  }[];

  formattingIssues: string[];
  grammarIssues: string[];
  missingSkills: string[];

  atsDetails?: Record<string, unknown>;
  structureAnalysis?: Record<string, unknown>;
  readability?: Record<string, unknown>;
  technicalSkillsMatch?: Record<string, unknown>;
  softSkillsMatch?: Record<string, unknown>;

  // Pro-only fields
  resumeRewrite?: {
    rewrittenSummary: string;
    improvedBulletPoints: {
      original: string;
      improved: string;
      reason: string;
    }[];
    suggestedSkillsSection: string;
    overallSuggestions: string[];
  };
  interviewQuestions?: {
    question: string;
    category: string;
    difficulty: string;
    suggestedApproach: string;
  }[];
  coverLetter?: string;
}

async function callAI(prompt: string): Promise<Record<string, unknown>> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1";

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  return JSON.parse(content);
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  isPro: boolean
): Promise<AnalysisResult> {
  // MOCK MODE: Return tailored fake analysis data for Anand Bora's resume
  console.log("MOCK MODE: Returning tailored analysis data for Anand Bora");
  
  const result: AnalysisResult = {
    overallScore: 94,
    atsScore: 98,
    grammarScore: 95,
    formattingScore: 92,
    keywordScore: 97,
    interviewReadiness: 90,
    matchedKeywords: [
      "Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker", "Kubernetes", "Machine Learning", 
      "CI/CD", "AWS", "Scikit-learn", "RESTful APIs", "Microservices", "Git", "System Design", "Agile",
      "TailwindCSS", "Next.js", "Redis", "Prometheus", "Grafana", "Data Pipelines"
    ],
    missingKeywords: ["GraphQL", "Kafka", "AWS Lambda", "Terraform", "gRPC", "Elasticsearch"],
    strengths: [
      "Excellent technical stack coverage (Python, React, Docker, K8s) perfectly aligning with modern Full-Stack engineering roles.", 
      "Outstanding use of quantifiable metrics throughout experience (e.g., 'reducing manual data-entry effort by nearly 70%', 'increased uptime to 99.9%').", 
      "Exceptional balance of full-stack product development and DevOps/Cloud native deployment practices.",
      "Demonstrated ability to build end-to-end systems from frontend (React/Next.js) to backend (FastAPI/PostgreSQL) and infrastructure (Docker/K8s).",
      "Strong evidence of integrating Machine Learning models into production environments.",
      "Clear progression of project complexity and leadership capabilities."
    ],
    weaknesses: [
      "Missing explicit mentions of messaging queues (Kafka, RabbitMQ) which are common in microservices architectures.",
      "Could elaborate slightly more on testing methodologies (e.g., PyTest, Jest) and code coverage metrics.",
      "Infrastructure-as-code (Terraform/CloudFormation) experience is implicitly required for K8s but not explicitly stated."
    ],
    suggestions: [
      { category: "Keywords", priority: "high", suggestion: "Explicitly mention 'Microservices Architecture' and 'System Design' in your summary to pass Senior-level ATS filters." },
      { category: "Experience", priority: "medium", suggestion: "For the HoneyCloud-X project, specify exactly how many concurrent users the system was designed to handle to show scale." },
      { category: "Testing", priority: "high", suggestion: "Add a dedicated 'Testing' section to your skills list including Jest, PyTest, or Cypress." },
      { category: "Formatting", priority: "low", suggestion: "Ensure all bullet points start with strong action verbs and are consistently punctuated." },
      { category: "Impact", priority: "medium", suggestion: "Quantify the business impact of the ML Threat Classification model (e.g., 'caught 95% of anomalous activity')." }
    ],
    formattingIssues: ["Inconsistent date formats (Use MM/YYYY consistently)"],
    grammarIssues: [],
    missingSkills: ["GraphQL", "Kafka", "Terraform"],
    atsDetails: { parsable: true, layout: "standard" },
    structureAnalysis: { sectionsFound: ["summary", "experience", "education", "technical skills", "projects", "achievements"] },
    readability: { score: "excellent", readingLevel: "professional" },
    technicalSkillsMatch: { score: 95, missing: ["GraphQL", "Kafka"] },
    softSkillsMatch: { score: 90, missing: ["Cross-functional Leadership"] }
  };

  result.resumeRewrite = {
    rewrittenSummary: "A highly capable Full-Stack Software Engineer specializing in Python/FastAPI backend systems and React/TypeScript frontend platforms. Proven track record of independently designing, building, and deploying scalable, containerized microservices architectures using Docker and Kubernetes. Adept at integrating applied machine learning components into production systems to solve complex business challenges. Passionate about driving measurable impact through clean code, automated CI/CD pipelines, and robust cloud infrastructure.",
    improvedBulletPoints: [
      { 
        original: "Collaborated cross-functionally on MOODLE LMS enhancements, including quiz creation and configuration", 
        improved: "Engineered scalable enhancements for the MOODLE LMS platform, optimizing quiz configuration workflows through cross-functional collaboration, resulting in a 40% reduction in administrative overhead.", 
        reason: "Uses stronger action verbs, emphasizes the engineering impact, and adds a quantifiable metric." 
      },
      {
        original: "Built a web dashboard using React and Tailwind",
        improved: "Architected and deployed a responsive, high-performance web dashboard using React, TypeScript, and TailwindCSS, improving user engagement by 25%.",
        reason: "Highlights architectural ownership and modern tech stack while showing business value."
      },
      {
        original: "Deployed ML model for threat detection",
        improved: "Designed and deployed a real-time Machine Learning threat classification pipeline using Scikit-learn and FastAPI, achieving 98% detection accuracy with sub-50ms latency.",
        reason: "Adds critical technical context (accuracy, latency, frameworks) that recruiters look for."
      }
    ],
    suggestedSkillsSection: "Languages: Python, TypeScript, JavaScript, SQL, Bash\nFrontend: React, Next.js, TailwindCSS, Redux\nBackend: FastAPI, Node.js, Express, PostgreSQL, Redis\nDevOps & Cloud: Docker, Kubernetes, AWS, CI/CD (GitHub Actions), Prometheus\nMachine Learning: Scikit-learn, Pandas, NumPy",
    overallSuggestions: [
      "Move the 'Technical Skills' section to the very top, immediately under your summary.",
      "Highlight your Hackathon achievements in a dedicated 'Awards & Honors' section to showcase initiative.",
      "Group your projects by domain (e.g., 'Cloud Infrastructure', 'Machine Learning') to tell a better story."
    ]
  };
  
  result.interviewQuestions = [
    { question: "Can you walk me through the architecture of your HoneyCloud-X SaaS platform and how you integrated the ML threat classification?", category: "System Design", difficulty: "Hard", suggestedApproach: "Discuss the API contract between FastAPI and the React dashboard, then explain how the Scikit-learn model was served in real-time. Draw a diagram on the whiteboard showing the data flow from the client, through the load balancer, to the FastAPI service and the ML inference worker." },
    { question: "How did you configure Prometheus and Grafana for your Incident Management project? What specific metrics were you tracking?", category: "DevOps", difficulty: "Medium", suggestedApproach: "Talk about your Prometheus scraping configurations (e.g., node_exporter, custom metrics endpoint in your app) and how you routed alerts using Alertmanager based on specific thresholds like HTTP 500 rates or CPU spikes." },
    { question: "Tell me about a time you had to optimize a slow database query. What was your approach?", category: "Database/Backend", difficulty: "Medium", suggestedApproach: "Discuss a specific scenario with PostgreSQL. Mention using EXPLAIN ANALYZE to identify sequential scans, adding proper indexes, or restructuring the query using CTEs/Joins to reduce execution time." },
    { question: "In your experience with React and TypeScript, how do you handle complex state management across a large application?", category: "Frontend", difficulty: "Medium", suggestedApproach: "Explain your thought process between using React Context API vs Redux vs Zustand. Emphasize how TypeScript interfaces help maintain type safety across the global state." }
  ];
  
  result.coverLetter = "Dear Hiring Manager,\n\nAs a full-stack software engineer with extensive experience building cloud-native applications using React, FastAPI, and Kubernetes, I am thrilled to apply for this Senior Software Engineer position. Throughout my career, I have consistently demonstrated the ability to bridge the gap between complex backend architectures and intuitive frontend user experiences.\n\nIn my recent project, HoneyCloud-X, I successfully engineered a multi-tenant SaaS platform from the ground up. By leveraging Docker and Kubernetes, I ensured high availability and seamless deployment pipelines. Furthermore, I integrated a real-time machine learning threat classification model using Scikit-learn, which highlights my ability to operate at the intersection of traditional software engineering and AI.\n\nI am particularly drawn to your engineering team's focus on scalable microservices and data-driven products. My background in both rapid prototyping (evidenced by my hackathon successes) and production-grade deployments makes me confident that I can hit the ground running and deliver immediate value to your organization.\n\nI would welcome the opportunity to discuss how my technical skills and product-focused mindset align with your team's goals. Thank you for your time and consideration.\n\nSincerely,\nAnand Santosh Bora";

  return result;
}
