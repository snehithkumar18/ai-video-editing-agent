'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Loader2 } from 'lucide-react';

interface StartGenerationButtonProps {
  projectId: string;
}

export default function StartGenerationButton({ projectId }: StartGenerationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to start generation');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-[#E5E3EB] rounded-3xl py-12 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-[#EDE9FE] text-[#7C3AED] rounded-full flex items-center justify-center mb-4">
          <Play size={32} className="ml-1 text-[#7C3AED]" />
        </div>
        <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">Ready to generate?</h3>
        <p className="text-[#78767B] text-sm font-medium max-w-md mb-6 leading-relaxed">
          Your script is ready. Once you generate the video, you can edit the timeline, adjust captions, and swap B-roll before final export.
        </p>
        
        {error && (
          <p className="text-sm text-red-500 font-semibold mb-4">{error}</p>
        )}

        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="btn-gradient text-white rounded-xl h-12 px-6 font-semibold text-sm flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting Generation...
            </>
          ) : (
            'Start Generation'
          )}
        </Button>
      </div>
    </Card>
  );
}
