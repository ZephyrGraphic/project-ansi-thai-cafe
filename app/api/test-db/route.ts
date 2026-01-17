
import { NextResponse } from 'next/server';
import dns from 'dns';
import net from 'net';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  // Extract host and port
  const match = dbUrl.match(/@([^:]+):(\d+)/);
  if (!match) {
    return NextResponse.json({ error: 'Could not parse Host/Port from DATABASE_URL' }, { status: 500 });
  }

  const host = match[1];
  const port = parseInt(match[2], 10);

  const results = {
    host,
    port,
    dns: null as any,
    tcp: null as any,
  };

  // 1. Test DNS
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.resolve(host, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
    results.dns = { success: true, addresses };
  } catch (err: any) {
    results.dns = { success: false, error: err.message };
  }

  // 2. Test TCP
  try {
    await new Promise<void>((resolve, reject) => {
      const socket = new net.Socket();
      socket.setTimeout(3000); // 3s timeout
      
      socket.on('connect', () => {
        socket.destroy();
        resolve();
      });

      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('Connection timed out'));
      });

      socket.on('error', (err) => {
        socket.destroy();
        reject(err);
      });

      socket.connect(port, host);
    });
    results.tcp = { success: true, message: 'Connected successfully' };
  } catch (err: any) {
    results.tcp = { success: false, error: err.message };
  }

  return NextResponse.json(results);
}
