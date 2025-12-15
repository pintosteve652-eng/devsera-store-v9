import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart, Clock, Key, Package, UserCheck, Zap, ShoppingCart, Star, Check, Flame } from 'lucide-react';
import { getFlashSaleInfoFromStorage } from '@/hooks/useFlashSale';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const deliveryIcons: Record<string, React.ReactNode> = {
  CREDENTIALS: <Key className="h-4 w-4" />,
  COUPON_CODE: <Package className="h-4 w-4" />,
  MANUAL_ACTIVATION: <UserCheck className="h-4 w-4" />,
  INSTANT_KEY: <Zap className="h-4 w-4" />
};

const deliveryLabels: Record<string, string> = {
  CREDENTIALS: 'Login Access',
  COUPON_CODE: 'License Key',
  MANUAL_ACTIVATION: 'Manual Setup',
  INSTANT_KEY: 'Instant Key'
};

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [flashSaleInfo, setFlashSaleInfo] = useState({ isOnFlashSale: false, discountAmount: 0 });

  // Check flash sale status
  useEffect(() => {
    if (!product) return;
    const checkFlashSale = () => {
      setFlashSaleInfo(getFlashSaleInfoFromStorage(product.id));
    };
    checkFlashSale();
    const interval = setInterval(checkFlashSale, 1000);
    return () => clearInterval(interval);
  }, [product?.id]);

  if (!product) return null;

  const baseSalePrice = product.salePrice || 0;
  const salePrice = flashSaleInfo.isOnFlashSale 
    ? Math.max(0, baseSalePrice - flashSaleInfo.discountAmount)
    : baseSalePrice;
  const originalPrice = flashSaleInfo.isOnFlashSale ? baseSalePrice : (product.originalPrice || 0);
  const savings = originalPrice - salePrice;
  const discountPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const handleBuyNow = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden max-h-[90vh] sm:max-h-[85vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto md:overflow-hidden">
          {/* Image Section */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 min-h-[200px] sm:min-h-[250px] md:min-h-0">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80'}
              alt={product.name}
              className="w-full h-[200px] sm:h-[250px] md:h-full object-cover"
            />
            {flashSaleInfo.isOnFlashSale ? (
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                <Badge className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 animate-pulse">
                  <Flame className="h-3 w-3 mr-1 inline" />
                  FLASH SALE -₹{flashSaleInfo.discountAmount}
                </Badge>
              </div>
            ) : discountPercent > 0 && (
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                <Badge className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
                  -{discountPercent}% OFF
                </Badge>
              </div>
            )}
            {/* Wishlist button on image - positioned to avoid close button overlap */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 sm:top-4 right-12 sm:right-14 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-lg z-10 ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/95 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 flex flex-col md:overflow-y-auto md:max-h-[85vh]">
            <DialogHeader className="text-left mb-3 sm:mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm">
                  {product.category}
                </Badge>
                <div className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                  <span className="text-xs sm:text-sm font-medium ml-1">4.9</span>
                </div>
              </div>
              <DialogTitle className="text-lg sm:text-2xl font-bold">{product.name}</DialogTitle>
            </DialogHeader>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
              {product.description}
            </p>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{product.duration}</span>
              </div>
              {product.deliveryType && (
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  {deliveryIcons[product.deliveryType]}
                  <span>{deliveryLabels[product.deliveryType]}</span>
                </div>
              )}
            </div>

            {/* Customer Requirements Message (Step 2) - shown when custom message is set or for manual activation */}
            {((product as any).customUserSeesLabel || product.deliveryType === 'MANUAL_ACTIVATION') && (
              <div className={`mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg ${
                product.deliveryType === 'MANUAL_ACTIVATION' 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
              }`}>
                <p className={`text-xs sm:text-sm flex items-start gap-2 ${
                  product.deliveryType === 'MANUAL_ACTIVATION'
                    ? 'text-amber-800 dark:text-amber-200'
                    : 'text-blue-800 dark:text-blue-200'
                }`}>
                  <span className="text-sm leading-none flex-shrink-0">
                    {product.deliveryType === 'MANUAL_ACTIVATION' ? '⚠️' : '📋'}
                  </span>
                  <span className="whitespace-pre-wrap">
                    {(product as any).customUserSeesLabel || 'You need to provide your account email/ID during checkout'}
                  </span>
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-3 sm:mb-4">
                <h4 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-500" />
                  What's Included:
                </h4>
                <div className="grid grid-cols-1 gap-1 sm:gap-1.5">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">
                      +{product.features.length - 3} more features
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <span className={`text-2xl sm:text-3xl font-bold ${flashSaleInfo.isOnFlashSale ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  ₹{salePrice.toLocaleString()}
                </span>
                {originalPrice > salePrice && (
                  <>
                    <span className="text-base sm:text-lg text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                    {flashSaleInfo.isOnFlashSale ? (
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                        <Flame className="h-3 w-3 mr-1 inline" />
                        Save ₹{flashSaleInfo.discountAmount}
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                        Save ₹{savings.toLocaleString()}
                      </Badge>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons - Stacked on mobile for better touch targets */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={handleBuyNow}
                  className={`flex-1 font-semibold h-11 sm:h-10 text-sm sm:text-base ${flashSaleInfo.isOnFlashSale 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white' 
                    : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white'}`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                  className={`h-11 sm:h-10 px-4 sm:hidden ${isInWishlist(product.id) ? 'border-red-500 text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                  className={`px-4 hidden sm:flex ${isInWishlist(product.id) ? 'border-red-500 text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
