import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CloseCircle, DocumentDownload, Sms, User } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";
import AuthenticatedLayout from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormData {
  nickname: string;
  email: string;
}

const ProfileEdit = () => {
  const { data: session } = useSession();

  //TODO: make these toggle gets data from backend(make it dynammic that syncs with app). Gombootoi yrij bgad hiih
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showArea, setShowArea] = useState(true);

  const { data: user } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => (session?.userId ? getUserById(session.userId) : null),
    enabled: !!session?.userId,
  });

  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    email: "",
  });

  useEffect(() => {
    if (user?.user) {
      setFormData({
        nickname: user.user.nickname || "",
        email: user.user.email || "",
      });
    }
  }, [user]);

  //TODO: Make this function work
  const handleDownloadData = async () => {
    // Implement data download logic here
    console.log("Downloading user data...");
    // You would typically make an API call to get the user's data
    // and then create a downloadable file (e.g., CSV or JSON)
  };

  const renderToggleItem = (label: string, value: boolean) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-white">{label}</span>
      <Switch checked={value} disabled />
    </div>
  );

  return (
    <AuthenticatedLayout headerType="page" headerTitle="Account">
      <div className="max-w-md mx-auto bg-gradient-to-b from-gray500 to-transparent rounded-3xl mt-12">
        <div className="px-4 py-6 border border-gray400 rounded-3xl overflow-hidden">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray50"
              >
                Nickname
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <Input
                  id="nickname"
                  name="nickname"
                  icon={<User className="text-gray100" />}
                  placeholder="Username"
                  value={formData.nickname}
                  disabled
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray50"
              >
                Email
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <Input
                  id="email"
                  name="email"
                  icon={<Sms className="text-gray100" />}
                  placeholder="Email"
                  value={formData.email}
                  disabled
                />
              </div>
            </div>

            {/* TODO: Alert iig app iin design language d oruulah(het oor haragdaj bga bolhoor app tai adilhan bolgoh) */}
            <Alert>
              <AlertTitle>GDPR Compliance</AlertTitle>
              <AlertDescription>
                To modify privacy settings or delete your account, please use
                our mobile app. You can download your data using the button
                below.
              </AlertDescription>
            </Alert>

            {renderToggleItem("Profile picture", showProfilePicture)}
            {renderToggleItem("Date of birth", showDateOfBirth)}
            {renderToggleItem("Country", showArea)}

            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={handleDownloadData}
              >
                <DocumentDownload className="mr-2" />
                Download Data
              </Button>
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full justify-center"
                disabled
              >
                <CloseCircle className="mr-2" />
                Delete Account
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray100">
            <p>
              To access full profile editing features and privacy settings,
              please use our mobile app.
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfileEdit;
