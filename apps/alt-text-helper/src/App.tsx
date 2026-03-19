import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">alt-text-helper</h1>
          <p className="text-muted-foreground">Tool placeholder</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>alt-text-helper</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Implementation pending</p>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
