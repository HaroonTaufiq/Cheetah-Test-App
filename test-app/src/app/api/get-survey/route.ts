import { NextResponse } from 'next/server'
import { z } from 'zod'

// Define specific error types
interface ValidationError {
  code: 'VALIDATION_ERROR'
  errors: z.ZodError['errors']
}

interface ServerError {
  code: 'SERVER_ERROR'
  message: string
}

interface RequestError {
  code: 'REQUEST_ERROR'
  message: string
}

// Union of all possible error types
type ApiError = ValidationError | ServerError | RequestError;

// Response data schemas with strict typing
const step2Schema = z.object({
  comfort: z.number().int().min(1).max(5),
  looks: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
}).strict(); // Ensures no additional properties

const surveyResponseSchema = z.object({
  email: z.string().email(),
  step: z.number().int().min(1).max(3),
  data: z.object({
    step1: z.enum(['orange', 'black']),
    step2: step2Schema,
  }).strict(),
  status: z.enum(['in-progress', 'completed']),
}).strict();

// Type for the validated response
type SurveyResponse = z.infer<typeof surveyResponseSchema>;

// Type for successful response
type SuccessResponse = {
  success: true;
  data: SurveyResponse;
};

// Type for error response
type ErrorResponse = {
  success: false;
  error: ApiError;
};

// Combined response type
type ApiResponse = SuccessResponse | ErrorResponse;

export async function GET(
  request: Request
): Promise<NextResponse<ApiResponse>> {
  try {
    // Validate request URL
    let url: URL;
    try {
      url = new URL(request.url);
    } catch (error) {
        console.log(error)
      return NextResponse.json({
        success: false,
        error: {
          code: 'REQUEST_ERROR',
          message: 'Invalid request URL',
        },
      } satisfies ErrorResponse, { status: 400 });
    }

    // Get and validate email parameter
    const email = url.searchParams.get('email');
    if (!email) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'REQUEST_ERROR',
          message: 'Email parameter is required',
        },
      } satisfies ErrorResponse, { status: 400 });
    }

    // Validate email format before making request
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          errors: emailValidation.error.errors,
        },
      } satisfies ErrorResponse, { status: 400 });
    }

    // Fetch survey data with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(
        `https://cheetah-test-app-flnl.vercel.app/api/get-survey?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId); 

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }

      // Parse and validate response
      let data: unknown;
      try {
        data = await response.json();
      } catch (error) {
        console.log(error)
        return NextResponse.json({
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Invalid JSON response from server',
          },
        } satisfies ErrorResponse, { status: 500 });
      }

      // Validate the response data
      const validationResult = surveyResponseSchema.safeParse(data);
      if (!validationResult.success) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            errors: validationResult.error.errors,
          },
        } satisfies ErrorResponse, { status: 400 });
      }

      // Return successful response
      return NextResponse.json({
        success: true,
        data: validationResult.data,
      } satisfies SuccessResponse, { status: 200 });

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Request timed out',
          },
        } satisfies ErrorResponse, { status: 504 });
      }

      throw error; // Re-throw other errors to be caught by outer try-catch
    }

  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
    } satisfies ErrorResponse, { status: 500 });
  }
}

// Frontend type-safe utility function
export async function fetchSurveyData(email: string): Promise<SurveyResponse> {
  const response = await fetch(`/api/survey?email=${encodeURIComponent(email)}`);
  const result = (await response.json()) as ApiResponse;
  
  if (!result.success) {
    throw new Error(`API Error: ${result.error.code} - ${
      'message' in result.error ? result.error.message : 
      'errors' in result.error ? JSON.stringify(result.error.errors) : 
      'Unknown error'
    }`);
  }
  
  return result.data;
}