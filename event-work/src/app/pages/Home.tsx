import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import { Event, getAllEvents } from '../../services/eventService';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Loader2, Sparkles, Filter, Ticket } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { filterEvents(); }, [searchQuery, categoryFilter, events]);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }
    setFilteredEvents(filtered);
  };

  const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black font-['Fredoka']">
      {/* Fancy Hero Section */}
      <header className="pt-12 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-4 border-black rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-[#2e8b57]/10 text-[#2e8b57] px-4 py-2 rounded-full mb-6 border-2 border-[#2e8b57]/20">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Live Your Best Life</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Discover <span className="text-[#2e8b57]">Amazing</span> Events Near You.
              </h1>
              <p className="text-xl text-zinc-600 font-medium max-w-md mb-8">
                The most curated selection of music, tech, and art events in the city.
              </p>
            </div>
            
            {/* Abstract Graphic */}
            <div className="absolute top-10 right-10 hidden lg:block">
               <div className="w-64 h-64 bg-[#2e8b57] rounded-[4rem] rotate-12 flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Ticket className="w-32 h-32 text-white -rotate-12" />
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 mb-12">
        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2e8b57]" />
            <Input
              placeholder="Search for an event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-zinc-50 border-2 border-black rounded-2xl text-lg focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2 bg-zinc-100 px-4 h-14 rounded-2xl border-2 border-black">
                <Filter className="h-5 w-5 text-zinc-500" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-none bg-transparent shadow-none focus:ring-0 font-bold min-w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-black rounded-2xl font-['Fredoka']">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#2e8b57]" />
            <p className="font-bold text-zinc-400">Loading the magic...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-zinc-200">
            <div className="bg-zinc-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="h-8 w-8 text-zinc-400" />
            </div>
            <p className="text-zinc-500 text-2xl font-bold">No events found matching your criteria</p>
            <Button variant="link" onClick={() => {setSearchQuery(''); setCategoryFilter('all')}} className="text-[#2e8b57] font-bold mt-2">Clear all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event.id} className="transition-transform hover:-translate-y-2">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}