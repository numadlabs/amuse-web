import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Lock,
  LogOut,
  HelpCircle,
  FileText,
  Mail,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/context/auth-context";
import {
  getUserById,
  getUserCard,
  getUserTaps,
  getUserTiers,
} from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";
import SERVER_SETTINGS from "@/lib/serverSettings";
import { useSession } from "next-auth/react";
import AuthenticatedLayout from "@/components/layout/layout";

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { onLogout } = useAuth();

  const { data: taps = [] } = useQuery({
    queryKey: userKeys.taps,
    queryFn: getUserTaps,
  });

  const { data: userTier = [], isLoading: isUserTierLoading } = useQuery({
    queryKey: userKeys.tier,
    queryFn: getUserTiers,
    enabled: !!session?.userId,
  });

  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: getUserCard,
  });

  const { data: user = [] } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => getUserById(session?.userId),
  });

  const userTierData = userTier.find(
    (tier) => tier.id === user?.user?.userTierId
  );

  return (
    <AuthenticatedLayout>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={`${SERVER_SETTINGS.PROFILE_PIC_LINK}${user?.user?.profilePicture}`}
              />
              <AvatarFallback>
                <User className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.user?.nickname}</h2>
              <p className="text-gray-500">Tier: {userTierData?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">Check-ins</p>
            <p className="text-2xl font-bold">{taps?.data?.taps.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">Memberships</p>
            <p className="text-2xl font-bold">
              {cards?.data?.cards.length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => router.push("/profile-edit")}
        >
          <span className="flex items-center">
            <User className="mr-2" /> Account
          </span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => (window.location.href = "mailto:info@amusebouche.io")}
        >
          <span className="flex items-center">
            <Mail className="mr-2" /> Contact
          </span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => router.push("/faq")}
        >
          <span className="flex items-center">
            <HelpCircle className="mr-2" /> FAQ
          </span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => router.push("/terms-and-conditions")}
        >
          <span className="flex items-center">
            <FileText className="mr-2" /> Terms and Conditions
          </span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => router.push("/privacy-policy")}
        >
          <span className="flex items-center">
            <Lock className="mr-2" /> Privacy
          </span>
          <ChevronRight />
        </Button>
        <Button variant="destructive" className="w-full" onClick={onLogout}>
          <LogOut className="mr-2" /> Log out
        </Button>
      </div>
    </AuthenticatedLayout>
  );
};

export default Profile;
