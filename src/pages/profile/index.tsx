import { useRouter } from "next/router";
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
import Link from "next/link";

interface UserTier {
  id: string;
  name: string;
}

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { onLogout } = useAuth();

  const { data: taps = [] } = useQuery({
    queryKey: userKeys.taps,
    queryFn: () => getUserTaps(),
  });

  const { data: userTier = [], isLoading: isUserTierLoading } = useQuery<
    UserTier[]
  >({
    queryKey: userKeys.tier,
    queryFn: () => getUserTiers(),
    enabled: !!session?.userId,
  });

  const { data: cards = [] } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => getUserCard(),
  });

  const { data: user } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => (session?.userId ? getUserById(session.userId) : null),
    enabled: !!session?.userId,
  });

  const userTierData = userTier.find(
    (tier) => tier.id === user?.user?.userTierId
  );

  return (
    <AuthenticatedLayout>
      <div className="mt-6 flex flex-col border border-gray400 rounded-2xl mb-4">
        <div className="flex flex-row p-4 items-center gap-5 bg-gradient-to-b from-gray500 to-transparent rounded-2xl border-b border-gray400">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={`${SERVER_SETTINGS.PROFILE_PIC_LINK}${user?.user?.profilePicture}`}
            />
            <AvatarFallback>
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-white">
              {user?.user?.nickname}
            </h2>
            
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 p-4">
          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <p className="text-gray100 text-md">Check-ins</p>
            <p className="text-2xl text-gray00 font-bold">
              {taps?.data?.taps.length || "00"}
            </p>
          </div>
          <div className="w-[1px] h-[58px] bg-gray400" />
          <button
            className="flex flex-col gap-2 w-full justify-center items-center"
            onClick={() => router.push("/memberships")}
          >
            <p className="text-gray100 text-md">Memberships</p>
            <p className="text-2xl text-gray00 font-bold">
              {cards?.data?.cards.length || "00"}
            </p>
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-16">
        <Button
          variant="ghost"
          className="w-full justify-between bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-2xl h-14"
          onClick={() => router.push("profile/edit")}
        >
          <span className="flex items-center">
            <User className="mr-2" /> Account
          </span>
          <ChevronRight />
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-between bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-2xl h-14"
          onClick={() => (window.location.href = "mailto:info@amusebouche.io")}
        >
          <span className="flex items-center">
            <Mail className="mr-2" /> Contact
          </span>
          <ChevronRight />
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-between bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-2xl h-14"
          onClick={() => router.push("/faq")}
        >
          <span className="flex items-center">
            <HelpCircle className="mr-2" /> FAQ
          </span>
          <ChevronRight />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-2xl h-14"
          // onClick={() => router.push("/terms-condition")}
          asChild
        >
          <Link
            href="https://www.thelumi.io/terms-conditions"
            target="_blank"
          >
            <span className="flex items-center">
              <FileText className="mr-2" /> Terms and Conditions
            </span>
            <ChevronRight />
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-between bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-2xl h-14"
          // onClick={() => router.push("/privacy")}
          asChild
        >
          <Link
            href="https://www.thelumi.io/privacy-policy"
            target="_blank"
          >
            <span className="flex items-center">
              <Lock className="mr-2" /> Privacy
            </span>
            <ChevronRight />
          </Link>
        </Button>
        <Button
          variant="secondary"
          size={"lg"}
          className="w-full"
          onClick={onLogout}
        >
          <LogOut className="mr-2" /> Log out
        </Button>
      </div>
    </AuthenticatedLayout>
  );
};

export default Profile;
