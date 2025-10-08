
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export default function handler(req: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}
