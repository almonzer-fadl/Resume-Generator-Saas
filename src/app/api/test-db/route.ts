import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    const connection = await connectToDatabase();
    
    if (connection) {
      console.log('Database connection successful');
      return NextResponse.json({ 
        status: 'success', 
        message: 'Database connection working',
        connectionState: connection.readyState
      });
    } else {
      console.log('Database connection failed - no connection returned');
      return NextResponse.json({ 
        status: 'error', 
        message: 'No connection returned' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: errorMessage
    }, { status: 500 });
  }
}
