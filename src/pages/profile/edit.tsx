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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface FormData {
  nickname: string;
  email: string;
  location: string;
  dateOfBirth: string;
  balance: string;
  convertedBalance: string;
  createdAt: string;
  visitCount: string;
  showProfilePicture: boolean;
  showDateOfBirth: boolean;
  showArea: boolean;
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
    location: "",
    dateOfBirth: "",
    balance: "",
    convertedBalance: "",
    createdAt: "",
    visitCount: "",
    showProfilePicture: false,
    showDateOfBirth: false,
    showArea: false,
  });

  useEffect(() => {
    if (user?.user) {
      setFormData({
        nickname: user.user.nickname || "",
        email: user.user.email || "",
        location: user.user.location || "",
        dateOfBirth: user.user.dateOfBirth || "",
        balance: user.user.balance || "",
        convertedBalance: user.user.convertedBalance || "",
        createdAt: user.user.createdAt || "",
        visitCount: user.user.visitCount || "",
        showProfilePicture: user.user.showProfilePicture || false,
        showDateOfBirth: user.user.showDateOfBirth || false,
        showArea: user.user.showArea || false,
      });
    }
  }, [user]);

  //TODO: Make this function work
  // const handleDownloadData = async () => {
  //   // Implement data download logic here
  //   console.log("Downloading user data...");
  //   // You would typically make an API call to get the user's data
  //   // and then create a downloadable file (e.g., CSV or JSON)
  // };
  const handleDownloadData = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      {
        Nickname: formData.nickname,
        Email: formData.email,
        location: formData.location,
        DateOfBirth: formData.dateOfBirth,
        Balance: formData.balance,
        ConvertedBalance: formData.convertedBalance,
        CreatedAt: formData.createdAt,
        VisitCount: formData.visitCount,
        "Show Profile Picture": showProfilePicture,
        "Show Date of Birth": showDateOfBirth,
        "Show Area": showArea,
      },
    ]);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "User Data");

    // Generate XLSX file
    const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });

    // Convert to Blob
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Save file
    saveAs(blob, "user_data.xlsx");
  };
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

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
            <Alert className="bg-gray500 rounded-2xl border border-gray400 flex flex-col gap-2">
              <AlertTitle className="text-bold text-gray50">
                GDPR Compliance
              </AlertTitle>
              <AlertDescription className="text-sm2 text-gray100">
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
