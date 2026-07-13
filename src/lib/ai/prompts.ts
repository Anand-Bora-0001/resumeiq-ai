export const SYSTEM_PROMPT = `You are ResumeIQ AI, an expert ATS (Applicant Tracking System) analyzer and career coach with 20+ years of experience in technical recruiting, HR, and resume optimization. You provide detailed, actionable, and honest feedback.

You must ALWAYS respond with valid JSON matching the exact schema requested. Never include markdown formatting, code blocks, or explanations outside the JSON structure.`;

export const ATS_SCORE_PROMPT = `Analyze this resume against the provided job description for ATS compatibility.

RESUME:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Evaluate the following and return a JSON object:
{
  "atsScore": <number 0-100>,
  "atsDetails": {
    "formatCompatibility": <number 0-100>,
    "keywordDensity": <number 0-100>,
    "sectionStructure": <number 0-100>,
    "contactInfoPresent": <boolean>,
    "dateFormatConsistent": <boolean>,
    "bulletPointsUsed": <boolean>,
    "lengthAppropriate": <boolean>,
    "noGraphicsOrTables": <boolean>
  },
  "atsIssues": [<string array of specific ATS compatibility issues found>],
  "atsSuggestions": [<string array of specific improvements for ATS compatibility>]
}

Be precise. Consider real-world ATS systems like Workday, Greenhouse, Lever, iCIMS, and Taleo.`;

export const KEYWORD_MATCH_PROMPT = `Analyze the keyword match between this resume and job description.

RESUME:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Return a JSON object:
{
  "keywordScore": <number 0-100>,
  "matchedKeywords": [<strings of keywords found in BOTH resume and job description>],
  "missingKeywords": [<strings of important keywords in job description but MISSING from resume>],
  "additionalKeywords": [<strings of relevant keywords in resume not in job description but still valuable>],
  "technicalSkillsMatch": {
    "matched": [<string array>],
    "missing": [<string array>]
  },
  "softSkillsMatch": {
    "matched": [<string array>],
    "missing": [<string array>]
  },
  "industryTerms": {
    "matched": [<string array>],
    "missing": [<string array>]
  }
}

Focus on technical skills, tools, frameworks, methodologies, certifications, and industry-specific terminology.`;

export const FORMATTING_ANALYSIS_PROMPT = `Analyze the formatting and structure of this resume.

RESUME:
{resumeText}

Return a JSON object:
{
  "formattingScore": <number 0-100>,
  "grammarScore": <number 0-100>,
  "formattingIssues": [<string array of formatting problems>],
  "grammarIssues": [<string array of grammar/spelling issues with corrections>],
  "structureAnalysis": {
    "hasSummary": <boolean>,
    "hasExperience": <boolean>,
    "hasEducation": <boolean>,
    "hasSkills": <boolean>,
    "hasProjects": <boolean>,
    "hasCertifications": <boolean>,
    "sectionOrder": [<string array of sections in order found>],
    "recommendedOrder": [<string array of optimal section order>]
  },
  "readability": {
    "score": <number 0-100>,
    "avgSentenceLength": <string>,
    "actionVerbUsage": <string "excellent" | "good" | "fair" | "poor">,
    "quantifiedAchievements": <number count of quantified results/metrics found>
  }
}`;

export const RESUME_REWRITE_PROMPT = `You are an expert resume writer. Rewrite and improve this resume to better match the job description while maintaining truthfulness.

RESUME:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Return a JSON object:
{
  "rewrittenSummary": <string - improved professional summary/objective>,
  "improvedBulletPoints": [
    {
      "original": <string>,
      "improved": <string>,
      "reason": <string explaining the improvement>
    }
  ],
  "suggestedSkillsSection": <string - optimized skills section>,
  "overallSuggestions": [<string array of high-level resume improvement suggestions>]
}

Rules:
- Never fabricate experience or skills
- Use strong action verbs
- Quantify achievements where possible
- Mirror language from the job description naturally
- Focus on relevance to the target role`;

export const INTERVIEW_READINESS_PROMPT = `Based on this resume and job description, assess interview readiness and generate likely interview questions.

RESUME:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Return a JSON object:
{
  "interviewReadinessScore": <number 0-100>,
  "strengths": [<string array of candidate's strongest talking points>],
  "weaknesses": [<string array of potential gaps or concerns an interviewer might raise>],
  "likelyQuestions": [
    {
      "question": <string>,
      "category": <string "technical" | "behavioral" | "situational" | "experience">,
      "difficulty": <string "easy" | "medium" | "hard">,
      "suggestedApproach": <string brief guidance on how to answer>
    }
  ],
  "coverLetterSuggestion": <string - a brief, tailored cover letter paragraph>
}`;

export function fillPromptTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}
