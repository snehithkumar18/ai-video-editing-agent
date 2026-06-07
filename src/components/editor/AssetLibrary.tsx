'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Film, Music, UploadCloud, Plus } from 'lucide-react';
import { useTimelineStore } from '@/store/useTimelineStore';
import logger from '@/lib/logger';

export default function AssetLibrary() {
  const [brollSearch, setBrollSearch] = useState('');
  const [brollResults, setBrollResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const addClip = useTimelineStore(s => s.addClip);
  const currentFrame = useTimelineStore(s => s.currentFrame);
  const timeline = useTimelineStore(s => s.timeline);

  const handleSearchBRoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brollSearch) return;
    
    setIsSearching(true);
    try {
      // In a real app this would route through a Next.js API route to hide the key
      const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(brollSearch)}&per_page=10&orientation=portrait`, {
        // Warning: Using client-side key for boilerplate only. Should proxy via API route.
        headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || '' }
      });
      const data = await res.json();
      setBrollResults(data.videos || []);
    } catch (e) {
      logger.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddBRoll = (video: any) => {
    if (!timeline) return;
    const brollTrack = timeline.tracks.find(t => t.id === 'broll-track');
    if (!brollTrack) return;

    const fps = timeline.fps || 30;
    const file = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];
    
    addClip('broll-track', {
      id: `broll-manual-${Date.now()}`,
      assetUrl: file.link,
      start: currentFrame / fps,
      end: (currentFrame / fps) + video.duration,
      duration: video.duration,
      opacity: 1.0,
      locked: false
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] border-l border-border">
      <Tabs defaultValue="broll" className="w-full flex flex-col h-full">
        <TabsList className="w-full grid grid-cols-3 bg-black border-b border-border rounded-none h-12 p-0">
          <TabsTrigger value="broll" className="rounded-none data-[state=active]:bg-[#141414] data-[state=active]:text-violet-400 data-[state=active]:border-b-2 data-[state=active]:border-violet-500">
            <Film size={14} className="mr-2" /> B-Roll
          </TabsTrigger>
          <TabsTrigger value="music" className="rounded-none data-[state=active]:bg-[#141414] data-[state=active]:text-violet-400 data-[state=active]:border-b-2 data-[state=active]:border-violet-500">
            <Music size={14} className="mr-2" /> Music
          </TabsTrigger>
          <TabsTrigger value="uploads" className="rounded-none data-[state=active]:bg-[#141414] data-[state=active]:text-violet-400 data-[state=active]:border-b-2 data-[state=active]:border-violet-500">
            <UploadCloud size={14} className="mr-2" /> Uploads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="broll" className="flex-1 overflow-y-auto p-4 m-0">
          <form onSubmit={handleSearchBRoll} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <Input 
              placeholder="Search Pexels..." 
              className="pl-9 bg-black border-border h-9 text-sm"
              value={brollSearch}
              onChange={(e) => setBrollSearch(e.target.value)}
            />
          </form>

          {isSearching ? (
            <div className="text-center text-sm text-gray-500 py-10">Searching...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {brollResults.map((video) => (
                <div key={video.id} className="relative aspect-[9/16] group bg-black rounded-md overflow-hidden border border-border">
                  <img src={video.image} alt="B-roll thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      onClick={() => handleAddBRoll(video)}
                      className="bg-violet-600 text-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                    {video.duration}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="music" className="flex-1 p-4 m-0 text-center text-gray-500 text-sm">
          Music integration coming soon.
        </TabsContent>
        <TabsContent value="uploads" className="flex-1 p-4 m-0 text-center text-gray-500 text-sm">
          User uploads coming soon.
        </TabsContent>
      </Tabs>
    </div>
  );
}
