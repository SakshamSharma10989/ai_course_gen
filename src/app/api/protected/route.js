// src/app/api/protected/route.js
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify({ message: 'Hello from protected API', userId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
