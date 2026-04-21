import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@admin-web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@admin-web/components/ui/card';

type DashboardStats = {
  userCount: number;
  songCount: number;
};

export function App() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to load dashboard stats');
      }

      const payload = (await response.json()) as { data: DashboardStats };
      setStats(payload.data);
      setLoadError(null);
    };

    run().catch((error) => {
      if (error instanceof Error) {
        setLoadError(error.message);
      } else {
        setLoadError('Failed to load dashboard stats');
      }
    });
  }, []);

  return (
    <main className='mx-auto max-w-6xl p-6'>
      <header className='mb-8 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Shield className='h-6 w-6 text-blue-600' />
          <div>
            <h1 className='text-2xl font-semibold'>NoteBlockWorld Admin</h1>
            <p className='text-sm text-slate-500'>
              Internal dashboard for moderation and operations.
            </p>
          </div>
        </div>
        <Button>Refresh</Button>
      </header>

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle>{stats?.userCount ?? '-'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Songs</CardDescription>
            <CardTitle>{stats?.songCount ?? '-'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending Reports</CardDescription>
            <CardTitle>0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>System Health</CardDescription>
            <CardTitle>Healthy</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className='mt-6 grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Review accounts and moderation actions.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm text-slate-500'>
            Placeholder table shell for user administration.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Song Management</CardTitle>
            <CardDescription>
              Review uploads and visibility state.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm text-slate-500'>
            Placeholder table shell for songs and report triage.
          </CardContent>
        </Card>
      </section>

      {loadError ? (
        <p className='mt-4 text-sm text-red-600'>{loadError}</p>
      ) : null}
    </main>
  );
}
