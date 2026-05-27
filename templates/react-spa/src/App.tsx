import { Button, Card, CardContent, CardHeader, CardTitle, Toaster, useToast } from '@tools/ui';

export default function App() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{{APP_TITLE}}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={() => toast({ title: 'Hello!' })}>
            Click me
          </Button>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
