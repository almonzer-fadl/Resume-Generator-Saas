import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTRATION API START ===');
    console.log('Registration API called');
    
    // Test database connection first
    console.log('Testing database connection...');
    try {
      await connectToDatabase();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError instanceof Error ? dbError.message : 'Unknown DB error' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    console.log('Request body received:', { ...body, password: '[REDACTED]' });
    
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      console.log('Validation failed:', { email: !!email, password: !!password, name: !!name });
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    console.log('All validations passed');

    // Check if user already exists
    console.log('Checking for existing user...');
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        console.log('User already exists:', existingUser.email);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      console.log('No existing user found, proceeding with creation');
    } catch (findError) {
      console.error('Error checking existing user:', findError);
      return NextResponse.json(
        { error: 'Error checking existing user', details: findError instanceof Error ? findError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    console.log('Creating new user...');
    try {
      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        name,
      });

      console.log('User object created, attempting to save...');
      await user.save();
      console.log('User saved successfully to database');

      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;

      console.log('Registration successful for:', userResponse.email);
      console.log('=== REGISTRATION API SUCCESS ===');
      
      return NextResponse.json(
        { 
          message: 'User created successfully',
          user: userResponse 
        },
        { status: 201 }
      );
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      
      // Check for specific MongoDB errors
      if (saveError instanceof Error) {
        if (saveError.message.includes('validation failed')) {
          return NextResponse.json(
            { error: 'Invalid data provided', details: saveError.message },
            { status: 400 }
          );
        }
        if (saveError.message.includes('duplicate key')) {
          return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 409 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to save user', details: saveError instanceof Error ? saveError.message : 'Unknown save error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('=== REGISTRATION API ERROR ===');
    console.error('Registration error details:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { error: 'Database connection not configured' },
          { status: 500 }
        );
      }
      if (error.message.includes('validation failed')) {
        return NextResponse.json(
          { error: 'Invalid data provided' },
          { status: 400 }
        );
      }
      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
