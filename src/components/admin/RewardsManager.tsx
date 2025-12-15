import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gift,
  Users,
  Coins,
  Crown,
  Trophy,
  Star,
  RefreshCw,
  TrendingUp,
  Download,
} from 'lucide-react';
import { exportToCSV, loyaltyColumns } from '@/utils/csvExport';

interface LoyaltyUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalPoints: number;
  lifetimePoints: number;
  tier: string;
}

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalPointsAwarded: number;
}

export function RewardsManager() {
  const { toast } = useToast();
  const [loyaltyUsers, setLoyaltyUsers] = useState<LoyaltyUser[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalPointsAwarded: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    bronzeUsers: 0,
    silverUsers: 0,
    goldUsers: 0,
    platinumUsers: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      // Load loyalty users
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select(`
          *,
          profile:profiles(full_name, name, email)
        `)
        .order('lifetime_points', { ascending: false });

      if (loyaltyError) throw loyaltyError;

      const mappedUsers = loyaltyData.map((l) => ({
        id: l.id,
        userId: l.user_id,
        userName: l.profile?.full_name || l.profile?.name || l.profile?.email?.split('@')[0] || 'Unknown',
        userEmail: l.profile?.email || '',
        totalPoints: l.total_points,
        lifetimePoints: l.lifetime_points,
        tier: l.tier,
      }));

      setLoyaltyUsers(mappedUsers);

      // Calculate stats
      setTotalStats({
        totalUsers: mappedUsers.length,
        totalPoints: mappedUsers.reduce((sum, u) => sum + u.lifetimePoints, 0),
        bronzeUsers: mappedUsers.filter(u => u.tier === 'bronze').length,
        silverUsers: mappedUsers.filter(u => u.tier === 'silver').length,
        goldUsers: mappedUsers.filter(u => u.tier === 'gold').length,
        platinumUsers: mappedUsers.filter(u => u.tier === 'platinum').length,
      });

      // Load referral stats
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*');

      if (referralError) throw referralError;

      const completed = referralData.filter(r => r.status === 'completed').length;
      setReferralStats({
        totalReferrals: referralData.length,
        completedReferrals: completed,
        pendingReferrals: referralData.filter(r => r.status === 'pending').length,
        totalPointsAwarded: completed * 150, // 100 for referrer + 50 for referred
      });
    } catch (err) {
      console.error('Error loading rewards data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTierIcon = (tier: string) => {
    if (tier === 'platinum') return <Crown className="h-4 w-4 text-purple-500" />;
    if (tier === 'gold') return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (tier === 'silver') return <Star className="h-4 w-4 text-gray-400 dark:text-gray-500" />;
    return <Star className="h-4 w-4 text-amber-600" />;
  };

  const getTierBadge = (tier: string) => {
    const styles = {
      bronze: 'bg-amber-100 text-amber-700',
      silver: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      gold: 'bg-yellow-100 text-yellow-700',
      platinum: 'bg-purple-100 text-purple-700',
    };
    return (
      <Badge className={`${styles[tier as keyof typeof styles]} capitalize`}>
        {getTierIcon(tier)}
        <span className="ml-1">{tier}</span>
      </Badge>
    );
  };

  const handleExport = () => {
    if (loyaltyUsers.length === 0) {
      toast({ title: 'No data to export', variant: 'destructive' });
      return;
    }
    exportToCSV(loyaltyUsers, loyaltyColumns, 'loyalty_members');
    toast({ title: 'Exported!', description: `${loyaltyUsers.length} members exported to CSV` });
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Rewards & Referrals
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={loyaltyUsers.length === 0}
            className="border border-gray-200 dark:border-gray-700 h-9"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="border border-gray-200 dark:border-gray-700 h-9"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 sm:p-4 text-white">
          <Coins className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 opacity-80" />
          <p className="text-lg sm:text-2xl font-bold">{totalStats.totalPoints.toLocaleString()}</p>
          <p className="text-[10px] sm:text-sm opacity-80">Total Points</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3 sm:p-4 text-white">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 opacity-80" />
          <p className="text-lg sm:text-2xl font-bold">{totalStats.totalUsers}</p>
          <p className="text-[10px] sm:text-sm opacity-80">Members</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 sm:p-4 text-white">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 opacity-80" />
          <p className="text-lg sm:text-2xl font-bold">{referralStats.completedReferrals}</p>
          <p className="text-[10px] sm:text-sm opacity-80">Referrals</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-3 sm:p-4 text-white">
          <Gift className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 opacity-80" />
          <p className="text-lg sm:text-2xl font-bold">{referralStats.totalPointsAwarded.toLocaleString()}</p>
          <p className="text-[10px] sm:text-sm opacity-80">Points Given</p>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-sm sm:text-xl font-bold text-amber-700 dark:text-amber-400">{totalStats.bronzeUsers}</p>
          <p className="text-[8px] sm:text-xs text-amber-600 dark:text-amber-400">Bronze</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-sm sm:text-xl font-bold text-gray-700 dark:text-gray-300">{totalStats.silverUsers}</p>
          <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Silver</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-sm sm:text-xl font-bold text-yellow-700 dark:text-yellow-400">{totalStats.goldUsers}</p>
          <p className="text-[8px] sm:text-xs text-yellow-600 dark:text-yellow-400">Gold</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
          <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-sm sm:text-xl font-bold text-purple-700 dark:text-purple-400">{totalStats.platinumUsers}</p>
          <p className="text-[8px] sm:text-xs text-purple-600 dark:text-purple-400">Platinum</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full sm:w-auto">
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Top</span> Members
          </TabsTrigger>
          <TabsTrigger
            value="referrals"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
            Referrals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          {isLoading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading members...</p>
            </div>
          ) : loyaltyUsers.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No loyalty members yet</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto">
              {loyaltyUsers.slice(0, 20).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-purple-600 dark:text-purple-400 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">{user.userName}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{user.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-xs sm:text-sm text-purple-600 dark:text-purple-400">{user.lifetimePoints.toLocaleString()}</p>
                      <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">Avail: {user.totalPoints}</p>
                    </div>
                    <div className="hidden sm:block">{getTierBadge(user.tier)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="referrals">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg sm:rounded-xl p-3 sm:p-6 text-center">
              <p className="text-xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">{referralStats.totalReferrals}</p>
              <p className="text-[10px] sm:text-sm text-blue-700 dark:text-blue-300 mt-1">Total</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg sm:rounded-xl p-3 sm:p-6 text-center">
              <p className="text-xl sm:text-4xl font-bold text-green-600 dark:text-green-400">{referralStats.completedReferrals}</p>
              <p className="text-[10px] sm:text-sm text-green-700 dark:text-green-300 mt-1">Done</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg sm:rounded-xl p-3 sm:p-6 text-center">
              <p className="text-xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400">{referralStats.pendingReferrals}</p>
              <p className="text-[10px] sm:text-sm text-amber-700 dark:text-amber-300 mt-1">Pending</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-sm sm:text-base mb-2">Program Details</h4>
            <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Referrer earns <span className="font-semibold text-purple-600">100 pts</span></li>
              <li>• Referred gets <span className="font-semibold text-pink-600">50 pts</span></li>
              <li>• Unlimited referrals</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
