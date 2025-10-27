import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - return 200 if server is running
    // Railway will configure DATABASE_URL in production
    const hasDatabase = !!process.env.DATABASE_URL;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'F12OS',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks: {
          server: 'running',
          database: hasDatabase ? 'configured' : 'not configured',
          railway: process.env.RAILWAY_ENVIRONMENT ? 'true' : 'false'
        },
        uptime: process.uptime()
      },
      { status: 200 }
    );
  } catch (error) {
    // If anything goes wrong, return 503
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
        service: 'F12OS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}