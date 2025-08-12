import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CoverLetter } from '@/lib/models/CoverLetter';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const coverLetter = new CoverLetter(body);
    await coverLetter.save();
    
    return NextResponse.json({ success: true, coverLetter }, { status: 201 });
  } catch (error) {
    console.error('Error creating cover letter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create cover letter' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }
    
    const coverLetters = await CoverLetter.find({ userId }).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, coverLetters });
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cover letters' },
      { status: 500 }
    );
  }
}
