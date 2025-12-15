import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, Pencil, Trash2, Eye, EyeOff, Calendar, 
  Link, ExternalLink, Sparkles, Gift, Clock, Shield, Zap, 
  Star, Heart, Crown, Megaphone, Tag, Percent, ShoppingBag, 
  Award, Bell, Target, TrendingUp, Flame, Coffee, Music, 
  Gamepad2, Tv, Camera 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BannerPost } from '@/hooks/useBannerPosts';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  gift: Gift,
  clock: Clock,
  shield: Shield,
  zap: Zap,
  star: Star,
  heart: Heart,
  crown: Crown,
  megaphone: Megaphone,
  tag: Tag,
  percent: Percent,
  'shopping-bag': ShoppingBag,
  award: Award,
  bell: Bell,
  target: Target,
  'trending-up': TrendingUp,
  flame: Flame,
  coffee: Coffee,
  music: Music,
  gamepad: Gamepad2,
  tv: Tv,
  camera: Camera,
};

const getIconComponent = (iconType: string) => {
  const IconComponent = ICON_MAP[iconType] || Sparkles;
  return <IconComponent className="h-6 w-6" />;
};

interface SortableBannerItemProps {
  banner: BannerPost;
  index: number;
  onEdit: (banner: BannerPost) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export function SortableBannerItem({ 
  banner, 
  index, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`brutalist-card p-4 ${banner.is_active ? 'border-green-500' : 'border-gray-300 opacity-60'} ${
        isDragging ? 'shadow-2xl scale-[1.02] bg-background ring-2 ring-teal-500' : ''
      } transition-shadow`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <div 
          className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-teal-500 transition-colors" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-muted px-2 py-0.5 rounded">
            {index + 1}
          </span>
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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-foreground truncate">{banner.title}</h3>
            {banner.is_active ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">Active</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">Inactive</Badge>
            )}
            {(banner.start_date || banner.end_date) && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Scheduled
              </Badge>
            )}
            {banner.image_url && (
              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                Has Image
              </Badge>
            )}
          </div>
          {banner.subtitle && (
            <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
          )}
          {banner.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{banner.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(banner.id, banner.is_active)}
            className={banner.is_active ? 'text-green-600 hover:text-green-700' : 'text-muted-foreground hover:text-foreground'}
          >
            {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(banner)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(banner.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}