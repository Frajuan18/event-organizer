import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrganizerSidebar from '../components/OrganizerSidebar';
import MobileSidebar from '../components/MobileSidebar';
import { Menu, Upload, X, Loader2, Calendar, Clock, MapPin, Tag, DollarSign, Users, Image as ImageIcon } from 'lucide-react';
import { createEvent, uploadEventImage } from '../../services/eventService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export default function CreateEvent() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    capacity: '',
    category: '',
    image_url: '',
  });

  React.useEffect(() => {
    if (!user || userProfile?.role !== 'organizer') {
      navigate('/');
    }
  }, [user, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadEventImage(file);
      setFormData({ ...formData, image_url: url });
      setImagePreview(URL.createObjectURL(file));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image_url: '' });
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) return;

    setLoading(true);
    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        price: parseFloat(formData.price) || 0,
        capacity: parseInt(formData.capacity) || 0,
        category: formData.category,
        image_url: formData.image_url,
        organizer_id: user.uid,
        organizer_name: userProfile.name,
      });

      toast.success('Event created successfully!');
      navigate('/organizer/manage-events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <OrganizerSidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-black p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">Create Event</h2>
            <button 
              onClick={() => setMobileOpen(true)} 
              className="p-2 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
              Create <span className="text-[#2e8b57]">Event</span>
            </h1>
            <div className="h-2 w-24 bg-[#2e8b57] mb-4"></div>
            <p className="text-zinc-600 text-lg font-medium">
              Fill in the details below to create your amazing event
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border-4 border-black rounded-[3rem] p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-[#2e8b57]" /> Event Image
                </Label>
                
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-80 object-cover rounded-2xl border-4 border-black"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-4 right-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="border-4 border-dashed border-black rounded-3xl p-12 text-center hover:bg-zinc-50 transition-colors">
                      <Upload className="h-16 w-16 text-[#2e8b57] mx-auto mb-4" />
                      <p className="text-lg font-bold mb-2">
                        {uploadingImage ? 'Uploading...' : 'Click to upload event image'}
                      </p>
                      <p className="text-sm text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#2e8b57]" /> Event Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Amazing Concert 2024"
                    className="h-14 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-lg font-bold uppercase tracking-wider">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell attendees what your event is about..."
                    className="border-4 border-black rounded-2xl text-lg p-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#2e8b57]" /> Date *
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="h-14 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#2e8b57]" /> Time *
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="h-14 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location" className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#2e8b57]" /> Location *
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="123 Main St, City, State"
                    className="h-14 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#2e8b57]" /> Price ($) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="29.99"
                    className="h-14 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#2e8b57]" /> Capacity *
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    placeholder="100"
                    className="h-14 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="category" className="text-lg font-bold uppercase tracking-wider">
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Music, Sports, Conference, etc."
                    className="h-14 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-4 border-black">
                <Button 
                  type="submit" 
                  disabled={loading || uploadingImage}
                  className="flex-1 bg-[#2e8b57] text-white hover:bg-[#1e5d3a] border-4 border-black rounded-2xl py-8 text-xl font-black uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/organizer/manage-events')}
                  className="flex-1 border-4 border-black rounded-2xl py-8 text-xl font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}