import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Upload, CheckCircle2, ArrowLeft, Package, Gift, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bundle } from '@/hooks/useBundles';
import { checkRateLimit, formatTimeRemaining } from '@/utils/rateLimiter';

export function BundleCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const bundle = location.state?.bundle as Bundle | undefined;
  const isBundle = location.state?.isBundle as boolean | undefined;
  
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { settings: dbSettings, isLoading: settingsLoading } = useSettings();
  const settings = dbSettings;

  // Redirect if no bundle data
  useEffect(() => {
    if (!bundle || !isBundle) {
      toast({
        title: 'No bundle selected',
        description: 'Please select a bundle from the bundles page.',
        variant: 'destructive',
      });
      navigate('/bundles');
    }
  }, [bundle, isBundle, navigate, toast]);

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 md:pb-0">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return null;
  }

  const handleCopyUPI = () => {
    if (settings) {
      navigator.clipboard.writeText(settings.upiId);
      toast({
        title: 'Copied!',
        description: 'UPI ID copied to clipboard',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Check rate limit
    const rateLimit = checkRateLimit('order-submit', 3, 300000);
    if (rateLimit.isLimited) {
      toast({
        title: 'Too many orders',
        description: `Please wait ${formatTimeRemaining(rateLimit.resetIn)} before placing another order.`,
        variant: 'destructive',
      });
      return;
    }

    if (!screenshot) {
      toast({
        title: 'Screenshot required',
        description: 'Please upload your payment screenshot',
        variant: 'destructive',
      });
      return;
    }

    if (screenshot.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Screenshot file size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(screenshot.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file (JPG, PNG, WebP, or GIF)',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to place an order',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsUploading(true);

    try {
      // Create orders for each product in the bundle
      const orderIds: string[] = [];
      
      for (const product of bundle.products) {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            product_id: product.id,
            status: 'PENDING',
            fulfillment_method: 'MANUAL',
          })
          .select()
          .single();

        if (orderError) throw orderError;
        orderIds.push(orderData.id);
      }

      // Upload screenshot for the first order (bundle reference)
      const firstOrderId = orderIds[0];
      
      // Simulate upload progress
      for (let i = 0; i <= 90; i += 5) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Upload to storage
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${firstOrderId}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, screenshot);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(fileName);

      // Update all orders with the screenshot and set status to SUBMITTED
      for (const orderId of orderIds) {
        await supabase
          .from('orders')
          .update({
            payment_screenshot: publicUrl,
            status: 'SUBMITTED',
          })
          .eq('id', orderId);
      }

      setUploadProgress(100);
      setOrderId(firstOrderId);

      toast({
        title: '🎉 Bundle order submitted!',
        description: `${bundle.products.length} products ordered. Payment is being verified.`,
      });

      // Navigate to orders page
      setTimeout(() => {
        navigate('/orders');
      }, 800);
    } catch (error: any) {
      console.error('Bundle order error:', error);
      toast({
        title: 'Order failed',
        description: error.message || 'Please try again or contact support',
        variant: 'destructive',
      });
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const discount = Math.round(((bundle.originalPrice - bundle.salePrice) / bundle.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/bundles')}
              className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bundles
            </Button>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Gift className="h-3 w-3 mr-1" />
              Bundle Deal
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Complete Your Bundle Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {bundle.products.length} products at an exclusive bundle price!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Payment Details
                </h2>
                <p className="text-purple-100 text-sm mt-1">Scan QR or use UPI ID</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                      {settings?.qrCodeUrl ? (
                        <img
                          src={settings.qrCodeUrl}
                          alt="Payment QR Code"
                          className="w-48 h-48 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <p className="text-gray-400 text-sm">QR not available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* UPI ID */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">UPI ID</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-xl px-4 py-3 font-mono text-sm">
                          {settings?.upiId || 'Not configured'}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyUPI}
                          className="rounded-xl"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ₹{bundle.salePrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        ₹{bundle.originalPrice.toLocaleString()}
                      </p>
                      <Badge className="mt-2 bg-green-500">
                        Save {discount}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div className="mt-8">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Upload Payment Screenshot
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="cursor-pointer">
                      {screenshot ? (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                          <span className="text-green-600 font-medium">{screenshot.name}</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            JPG, PNG, WebP, GIF (max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Progress */}
                {isUploading && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Processing order... {uploadProgress}%
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!screenshot || isUploading}
                  className="w-full mt-6 h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-lg"
                >
                  {isUploading ? 'Processing...' : 'Confirm Order'}
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-500" />
                Bundle Summary
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-4 border-b dark:border-gray-700">
                  {bundle.imageUrl ? (
                    <img src={bundle.imageUrl} alt={bundle.name} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <Package className="h-8 w-8 text-purple-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{bundle.name}</h4>
                    <p className="text-sm text-gray-500">{bundle.products.length} products</p>
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Includes:</p>
                  {bundle.products.map((product) => (
                    <div key={product.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="pt-4 border-t dark:border-gray-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Original Price</span>
                    <span className="text-gray-500 line-through">₹{bundle.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Bundle Discount</span>
                    <span className="text-green-600">-₹{(bundle.originalPrice - bundle.salePrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-purple-600">₹{bundle.salePrice.toLocaleString()}</span>
                  </div>
                </div>

                {bundle.validUntil && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">
                    <Clock className="h-4 w-4" />
                    <span>Offer expires soon</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
