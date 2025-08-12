import { NextRequest, NextResponse } from 'next/server';
import { generateResumeContent } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, jobDescription, userExperience, userSkills, userEducation, userSummary, tone } = await request.json();

    // Only require essential fields
    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: 'Job title and job description are required' },
        { status: 400 }
      );
    }

    // Set default values for missing fields
    const aiRequest = {
      jobTitle,
      jobDescription,
      userExperience: userExperience || "General professional experience",
      userSkills: userSkills || "Professional skills",
      userEducation: userEducation || "Educational background",
      userSummary: userSummary || "Professional summary",
      tone: tone || "professional"
    };

    // Generate resume content using OpenAI
    const content = await generateResumeContent(aiRequest);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Resume generation error:', error);
    
    // Check if it's an environment variable issue
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'OpenAI API is not configured. Please contact support.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate resume content. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Placeholder for getting resumes
    return NextResponse.json({ message: 'Resumes endpoint' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}
