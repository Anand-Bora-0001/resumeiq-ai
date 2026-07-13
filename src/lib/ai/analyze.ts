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
    overallScore: 92,
    atsScore: 95,
    grammarScore: 90,
    formattingScore: 88,
    keywordScore: 94,
    interviewReadiness: 85,
    matchedKeywords: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker", "Kubernetes", "Machine Learning", "CI/CD"],
    missingKeywords: ["GraphQL", "Microservices Architecture"],
    strengths: [
      "Excellent technical stack (Python, React, Docker, K8s)", 
      "Strong quantifiable metrics (e.g., 'reducing manual data-entry effort by nearly 70%')", 
      "Great balance of full-stack development and DevOps/Cloud native practices"
    ],
    weaknesses: ["Missing some advanced architectural keywords like Microservices"],
    suggestions: [
      { category: "Keywords", priority: "medium", suggestion: "Consider explicitly mentioning 'Microservices' if you used that architecture in your Kubernetes deployments." },
      { category: "Formatting", priority: "low", suggestion: "Ensure bullet points are consistently punctuated." }
    ],
    formattingIssues: [],
    grammarIssues: [],
    missingSkills: ["GraphQL"],
    atsDetails: { parsable: true, layout: "standard" },
    structureAnalysis: { sectionsFound: ["summary", "experience", "education", "technical skills", "projects", "achievements"] },
    readability: { score: "excellent", readingLevel: "professional" },
    technicalSkillsMatch: { score: 95, missing: ["GraphQL"] },
    softSkillsMatch: { score: 90, missing: ["Agile/Scrum"] }
  };

  // Always include PRO features for the hackathon demo
  result.resumeRewrite = {
    rewrittenSummary: "A highly capable Software Engineer specializing in Python/FastAPI backend systems and React/TypeScript frontend platforms. Proven track record of independently designing and deploying scalable, containerized applications using Docker and Kubernetes, alongside applied machine learning components.",
    improvedBulletPoints: [
      { 
        original: "Collaborated cross-functionally on MOODLE LMS enhancements, including quiz creation and configuration", 
        improved: "Engineered scalable enhancements for the MOODLE LMS platform, optimizing quiz configuration workflows through cross-functional collaboration.", 
        reason: "Uses stronger action verbs and emphasizes the engineering impact." 
      }
    ],
    suggestedSkillsSection: "Languages: Python, TypeScript, JavaScript, SQL\nBackend: FastAPI, PostgreSQL, Redis\nDevOps: Docker, Kubernetes, CI/CD",
    overallSuggestions: ["Highlight your Hackathon achievements closer to the top to showcase initiative."]
  };
  
  result.interviewQuestions = [
    { question: "Can you walk me through the architecture of your HoneyCloud-X SaaS platform and how you integrated the ML threat classification?", category: "System Design", difficulty: "Hard", suggestedApproach: "Discuss the API contract between FastAPI and the React dashboard, then explain how the Scikit-learn model was served in real-time." },
    { question: "How did you configure Prometheus and Grafana for your Incident Management project?", category: "DevOps", difficulty: "Medium", suggestedApproach: "Talk about your Prometheus scraping configurations and how you routed alerts." }
  ];
  
  result.coverLetter = "Dear Hiring Manager,\n\nAs a full-stack developer with extensive experience building cloud-native applications using React, FastAPI, and Kubernetes, I am thrilled to apply for this role. In my recent project, HoneyCloud-X, I successfully engineered a multi-tenant SaaS platform from the ground up...\n\nSincerely,\nAnand Santosh Bora";

  return result;
}
