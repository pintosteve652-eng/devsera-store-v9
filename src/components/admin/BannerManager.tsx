import { useState, useRef } from 'react';
import { 
  Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, RefreshCw, 
  Sparkles, Gift, Clock, Shield, Zap, Star, Heart, Crown, 
  Image as ImageIcon, Link, Calendar, ChevronUp, ChevronDown,
  ExternalLink, Palette, Upload, X, AlignLeft, AlignCenter, AlignRight,
  Layers, Type, Megaphone, Tag, Percent, ShoppingBag, Award, Bell,
  Target, TrendingUp, Flame, Coffee, Music, Gamepad2, Tv, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAdminBannerPosts, BannerPost } from '@/hooks/useBannerPosts';
import { supabase } from '@/lib/supabase';

const ICON_OPTIONS = [
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'crown', label: 'Crown', icon: Crown },
  { value: 'megaphone', label: 'Megaphone', icon: Megaphone },
  { value: 'tag', label: 'Tag', icon: Tag },
  { value: 'percent', label: 'Percent', icon: Percent },
  { value: 'shopping-bag', label: 'Shopping Bag', icon: ShoppingBag },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'bell', label: 'Bell', icon: Bell },
  { value: 'target', label: 'Target', icon: Target },
  { value: 'trending-up', label: 'Trending', icon: TrendingUp },
  { value: 'flame', label: 'Flame', icon: Flame },
  { value: 'coffee', label: 'Coffee', icon: Coffee },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'gamepad', label: 'Gaming', icon: Gamepad2 },
  { value: 'tv', label: 'TV', icon: Tv },
  { value: 'camera', label: 'Camera', icon: Camera },
];

const GRADIENT_OPTIONS = [
  { value: 'from-teal-600 via-teal-700 to-emerald-800', label: 'Teal Emerald', preview: 'bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-800' },
  { value: 'from-purple-600 via-pink-600 to-purple-800', label: 'Purple Pink', preview: 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800' },
  { value: 'from-amber-500 via-orange-500 to-red-600', label: 'Amber Orange', preview: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600' },
  { value: 'from-blue-600 via-indigo-600 to-purple-700', label: 'Blue Indigo', preview: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700' },
  { value: 'from-green-500 via-emerald-500 to-teal-600', label: 'Green Emerald', preview: 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600' },
  { value: 'from-rose-500 via-pink-500 to-fuchsia-600', label: 'Rose Pink', preview: 'bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600' },
  { value: 'from-cyan-500 via-blue-500 to-indigo-600', label: 'Cyan Blue', preview: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600' },
  { value: 'from-yellow-500 via-amber-500 to-orange-600', label: 'Yellow Amber', preview: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600' },
  { value: 'from-slate-700 via-slate-800 to-slate-900', label: 'Slate Dark', preview: 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900' },
  { value: 'from-red-600 via-rose-600 to-pink-700', label: 'Red Rose', preview: 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-700' },
  { value: 'from-violet-600 via-purple-600 to-indigo-700', label: 'Violet Purple', preview: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700' },
  { value: 'from-lime-500 via-green-500 to-emerald-600', label: 'Lime Green', preview: 'bg-gradient-to-r from-lime-500 via-green-500 to-emerald-600' },
  { value: 'from-sky-500 via-cyan-500 to-teal-600', label: 'Sky Cyan', preview: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-600' },
  { value: 'from-fuchsia-600 via-pink-600 to-rose-700', label: 'Fuchsia Pink', preview: 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-700' },
  { value: 'from-gray-800 via-gray-900 to-black', label: 'Dark Black', preview: 'bg-gradient-to-r from-gray-800 via-gray-900 to-black' },
  { value: 'from-orange-600 via-red-600 to-rose-700', label: 'Orange Fire', preview: 'bg-gradient-to-r from-orange-600 via-red-600 to-rose-700' },
];

const getIconComponent = (iconType: string) => {
  const iconOption = ICON_OPTIONS.find(opt => opt.value === iconType);
  if (iconOption) {
    const IconComponent = iconOption.icon;
    return <IconComponent className="h-6 w-6" />;
  }
  return <Sparkles className="h-6 w-6" />;
};

export function BannerManager() {
  const { toast } = useToast();
  const { banners, isLoading, refetch, createBanner, updateBanner, deleteBanner, toggleBannerStatus, reorderBanners } = useAdminBannerPosts();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: 'Shop Now',
    button_link: '/',
    gradient: 'from-teal-600 via-teal-700 to-emerald-800',
    icon_type: 'sparkles',
    image_url: '',
    is_active: true,
    start_date: '',
    end_date: '',
    text_align: 'center' as 'left' | 'center' | 'right',
    overlay_opacity: 50,
    show_icon: true,
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      button_text: 'Shop Now',
      button_link: '/',
      gradient: 'from-teal-600 via-teal-700 to-emerald-800',
      icon_type: 'sparkles',
      image_url: '',
      is_active: true,
      start_date: '',
      end_date: '',
      text_align: 'center',
      overlay_opacity: 50,
      show_icon: true,
    });
    setEditingBanner(null);
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image must be less than 5MB', variant: 'destructive' });
      return;
    }
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };
  
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: BannerPost) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      button_text: banner.button_text,
      button_link: banner.button_link,
      gradient: banner.gradient,
      icon_type: banner.icon_type,
      image_url: banner.image_url || '',
      is_active: banner.is_active,
      start_date: banner.start_date ? banner.start_date.split('T')[0] : '',
      end_date: banner.end_date ? banner.end_date.split('T')[0] : '',
      text_align: 'center',
      overlay_opacity: 50,
      show_icon: true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const bannerData = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (editingBanner) {
        await updateBanner(editingBanner.id, bannerData);
        toast({ title: 'Success', description: 'Banner updated successfully' });
      } else {
        await createBanner(bannerData);
        toast({ title: 'Success', description: 'Banner created successfully' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to save banner', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      await deleteBanner(id);
      toast({ title: 'Deleted', description: 'Banner deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete banner', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleBannerStatus(id, !currentStatus);
      toast({ title: 'Updated', description: `Banner ${!currentStatus ? 'activated' : 'deactivated'}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...banners];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await reorderBanners(newOrder.map(b => b.id));
  };

  const handleMoveDown = async (index: number) => {
    if (index === banners.length - 1) return;
    const newOrder = [...banners];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    await reorderBanners(newOrder.map(b => b.id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-teal-600" />
            Banner / Ad Post Manager
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage the auto-scrolling banners on the front page
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} className="border-2 border-gray-300">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
            <Plus className="h-4 w-4 mr-1" />
            Add Banner
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="brutalist-card p-4 border-teal-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Banners</p>
          <p className="text-2xl font-bold text-teal-600">{banners.length}</p>
        </div>
        <div className="brutalist-card p-4 border-green-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-600">{banners.filter(b => b.is_active).length}</p>
        </div>
        <div className="brutalist-card p-4 border-gray-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Inactive</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{banners.filter(b => !b.is_active).length}</p>
        </div>
        <div className="brutalist-card p-4 border-purple-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled</p>
          <p className="text-2xl font-bold text-purple-600">{banners.filter(b => b.start_date || b.end_date).length}</p>
        </div>
      </div>

      {/* Banner List */}
      <div className="space-y-3">
        {banners.length === 0 ? (
          <div className="text-center py-12 brutalist-card">
            <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No banners yet. Create your first banner!</p>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div 
              key={banner.id} 
              className={`brutalist-card p-4 ${banner.is_active ? 'border-green-500' : 'border-gray-300 opacity-60'}`}
            >
              <div className="flex items-start gap-4">
                {/* Drag Handle & Order Controls */}
                <div className="flex flex-col items-center gap-1">
                  <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500 cursor-grab" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{index + 1}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleMoveDown(index)}
                    disabled={index === banners.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Preview */}
                <div className={`w-24 h-16 rounded-lg bg-gradient-to-br ${banner.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 relative overflow-hidden`}>
                  {banner.image_url && (
                    <img 
                      src={banner.image_url} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className={`relative z-10 ${banner.image_url ? 'bg-black/30 p-1 rounded' : ''}`}>
                    {getIconComponent(banner.icon_type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{banner.title}</h3>
                    {banner.is_active ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Inactive</Badge>
                    )}
                    {(banner.start_date || banner.end_date) && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Scheduled
                      </Badge>
                    )}
                  </div>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{banner.subtitle}</p>
                  )}
                  {banner.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{banner.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      {banner.button_link}
                    </span>
                    <span className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {banner.button_text}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(banner.id, banner.is_active)}
                    className={banner.is_active ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}
                  >
                    {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(banner)}
                    className="text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-teal-600" />
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </TabsTrigger>
            </TabsList>

            {/* Live Preview */}
            <div className="my-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Live Preview</Label>
              <div 
                className={`relative rounded-xl overflow-hidden shadow-lg`}
                style={{ minHeight: '180px' }}
              >
                {/* Background Image or Gradient */}
                {formData.image_url ? (
                  <>
                    <img 
                      src={formData.image_url} 
                      alt="Banner background" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${formData.gradient}`}
                      style={{ opacity: formData.overlay_opacity / 100 }}
                    />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${formData.gradient}`} />
                )}
                
                {/* Content */}
                <div className={`relative z-10 p-6 text-white h-full flex flex-col justify-center ${
                  formData.text_align === 'left' ? 'items-start text-left' : 
                  formData.text_align === 'right' ? 'items-end text-right' : 'items-center text-center'
                }`}>
                  <div className={`flex items-center gap-3 mb-2 ${
                    formData.text_align === 'left' ? 'flex-row' :
                    formData.text_align === 'right' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    {formData.show_icon && getIconComponent(formData.icon_type)}
                    <div>
                      <h3 className="font-bold text-xl">{formData.title || 'Banner Title'}</h3>
                      {formData.subtitle && (
                        <p className="text-sm opacity-90 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200 font-semibold">
                          {formData.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  {formData.description && (
                    <p className="text-sm opacity-90 mb-4 max-w-md">{formData.description}</p>
                  )}
                  <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                    {formData.button_text || 'Shop Now'}
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="content" className="space-y-4 mt-4">
              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Premium Services"
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Unbeatable Prices"
                    className="border-2"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Get instant access to premium services at amazing prices!"
                  className="border-2"
                  rows={3}
                />
              </div>

              {/* Button Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Button Text
                  </Label>
                  <Input
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Shop Now"
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Button Link
                  </Label>
                  <Input
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="/"
                    className="border-2"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4 mt-4">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Background Image
                </Label>
                
                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="border-2 border-dashed"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <span className="text-xs text-muted-foreground self-center">or</span>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Paste image URL..."
                    className="border-2 flex-1"
                  />
                </div>
                
                {formData.image_url && (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden border-2 border-border">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Overlay Opacity (only show when image is set) */}
              {formData.image_url && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Gradient Overlay Opacity: {formData.overlay_opacity}%
                  </Label>
                  <Slider
                    value={[formData.overlay_opacity]}
                    onValueChange={([value]) => setFormData({ ...formData, overlay_opacity: value })}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}

              {/* Gradient Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Gradient Color
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, gradient: opt.value })}
                      className={`h-12 rounded-lg ${opt.preview} transition-all ${
                        formData.gradient === opt.value 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-105' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Banner Icon
                  </Label>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Show Icon</Label>
                    <Switch
                      checked={formData.show_icon}
                      onCheckedChange={(checked) => setFormData({ ...formData, show_icon: checked })}
                    />
                  </div>
                </div>
                {formData.show_icon && (
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const IconComp = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setFormData({ ...formData, icon_type: opt.value })}
                          className={`p-2 rounded-lg border-2 transition-all flex items-center justify-center ${
                            formData.icon_type === opt.value 
                              ? 'border-teal-500 bg-teal-500/10 text-teal-600' 
                              : 'border-border hover:border-teal-300'
                          }`}
                          title={opt.label}
                        >
                          <IconComp className="h-5 w-5" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Text Alignment */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4" />
                  Text Alignment
                </Label>
                <div className="flex gap-2">
                  {[
                    { value: 'left', icon: AlignLeft, label: 'Left' },
                    { value: 'center', icon: AlignCenter, label: 'Center' },
                    { value: 'right', icon: AlignRight, label: 'Right' },
                  ].map((align) => {
                    const AlignIcon = align.icon;
                    return (
                      <Button
                        key={align.value}
                        type="button"
                        variant={formData.text_align === align.value ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, text_align: align.value as 'left' | 'center' | 'right' })}
                        className="flex-1"
                      >
                        <AlignIcon className="h-4 w-4 mr-2" />
                        {align.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              {/* Active Status */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label className="font-semibold">Active Status</Label>
                  <p className="text-xs text-muted-foreground">Enable to show this banner on the front page</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date (Optional)
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="border-2"
                  />
                  <p className="text-xs text-muted-foreground">Banner will start showing from this date</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date (Optional)
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="border-2"
                  />
                  <p className="text-xs text-muted-foreground">Banner will stop showing after this date</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  💡 <strong>Tip:</strong> Leave dates empty for the banner to always show when active. 
                  Use scheduling for time-limited promotions or seasonal campaigns.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                editingBanner ? 'Update Banner' : 'Create Banner'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
