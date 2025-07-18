import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
        <Input type="text" placeholder="Enter text here" className="mb-4" />
        <Button className="mb-4">Click Me</Button>
        <Progress value={50} className="w-full" />
      </Card>
    </div>
  );
}
