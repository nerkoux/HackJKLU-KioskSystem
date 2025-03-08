import { NextRequest } from 'next/server';

export interface RouteParams {
  params: {
    userId: string;
  };
}

export function GET(request: NextRequest, context: RouteParams): Promise<Response>;