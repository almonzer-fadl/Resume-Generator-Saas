import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for AI generation
export interface ResumeGenerationRequest {
  jobTitle: string;
  jobDescription: string;
  userExperience: string;
  userSkills: string;
  userEducation: string;
  userSummary: string;
  tone: 'professional' | 'creative' | 'friendly' | 'confident';
}

export interface CoverLetterGenerationRequest {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  userExperience: string;
  userSkills: string;
  userEducation: string;
  userSummary: string;
  tone: 'professional' | 'friendly' | 'enthusiastic' | 'confident';
  length: 'short' | 'medium' | 'long';
}

// AI-powered resume content generation
export async function generateResumeContent(request: ResumeGenerationRequest): Promise<string> {
  try {
    const prompt = `You are an expert resume writer. Create a professional resume summary and experience descriptions based on the following information:

Job Title: ${request.jobTitle}
Job Description: ${request.jobDescription}
User Experience: ${request.userExperience}
User Skills: ${request.userSkills}
User Education: ${request.userEducation}
User Summary: ${request.userSummary}
Tone: ${request.tone}

Generate:
1. A compelling professional summary (2-3 sentences)
2. 3-4 strong bullet points for work experience that match the job requirements
3. 2-3 bullet points for skills that align with the job description

Make the content specific, measurable, and tailored to the job. Use action verbs and quantifiable achievements when possible.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer who creates compelling, ATS-friendly content tailored to specific job descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Failed to generate content';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate resume content');
  }
}

// AI-powered cover letter generation
export async function generateCoverLetterContent(request: CoverLetterGenerationRequest): Promise<string> {
  try {
    const lengthGuide = {
      short: '2-3 paragraphs',
      medium: '3-4 paragraphs', 
      long: '4-5 paragraphs'
    };

    const prompt = `You are an expert cover letter writer. Create a personalized cover letter for the following job application:

Job Title: ${request.jobTitle}
Company: ${request.companyName}
Job Description: ${request.jobDescription}
User Experience: ${request.userExperience}
User Skills: ${request.userSkills}
User Education: ${request.userEducation}
User Summary: ${request.userSummary}
Tone: ${request.tone}
Length: ${lengthGuide[request.length]}

Generate a compelling cover letter that:
1. Addresses the hiring manager professionally
2. Explains why you're interested in this specific role and company
3. Highlights relevant experience and skills that match the job requirements
4. Shows enthusiasm and fit for the company culture
5. Ends with a strong call to action

Make it personal, specific to the job, and match the requested tone and length.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer who creates compelling, personalized letters that help candidates stand out."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Failed to generate content';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate cover letter content');
  }
}
