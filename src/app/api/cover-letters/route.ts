import { NextRequest, NextResponse } from 'next/server';
import { generateCoverLetterContent } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, companyName, jobDescription, userExperience, userSkills, userEducation, userSummary, tone, length } = await request.json();

    // Only require essential fields
    if (!jobTitle || !companyName || !jobDescription) {
      return NextResponse.json(
        { error: 'Job title, company name, and job description are required' },
        { status: 400 }
      );
    }

    // Set default values for missing fields
    const aiRequest = {
      jobTitle,
      companyName,
      jobDescription,
      userExperience: userExperience || "General professional experience",
      userSkills: userSkills || "Professional skills",
      userEducation: userEducation || "Educational background",
      userSummary: userSummary || "Professional summary",
      tone: tone || "professional",
      length: length || "medium"
    };

    // Generate cover letter content using OpenAI
    const content = await generateCoverLetterContent(aiRequest);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    
    // Check if it's an environment variable issue
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'OpenAI API is not configured. Please contact support.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate cover letter content. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Placeholder for getting cover letters
    return NextResponse.json({ message: 'Cover letters endpoint' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch cover letters' },
      { status: 500 }
    );
  }
}
