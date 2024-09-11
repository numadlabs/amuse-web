import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Image from "next/image";
import { Cake, Camera, Location, Sms, User } from "iconsax-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";
import { updateUserInfo } from "@/lib/service/mutationHelper";
import AuthenticatedLayout from "@/components/layout/layout";
import { Input } from "@/components/ui/input";

interface FormData {
  nickname: string;
  email: string;
  location: string;
  dateOfBirth: string;
  profilePicture: string | null;
}

const ProfileEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

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
    profilePicture: null,
  });

  const [loading, setLoading] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isProfilePrefilled =
    user?.user?.email && user?.user?.location && user?.user?.dateOfBirth;

  useEffect(() => {
    if (user?.user) {
      setFormData({
        nickname: user.user.nickname || "",
        email: user.user.email || "",
        location: user.user.location || "",
        dateOfBirth: user.user.dateOfBirth || "",
        profilePicture: user.user.profilePicture || null,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.user) {
      const hasChanged =
        user.user.nickname !== formData.nickname ||
        user.user.email !== formData.email ||
        user.user.location !== formData.location ||
        user.user.dateOfBirth !== formData.dateOfBirth ||
        user.user.profilePicture !== formData.profilePicture;

      setDataChanged(hasChanged);
    }
  }, [user, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    setError("");
    setEmailError("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const triggerUpdateUser = async () => {
    setLoading(true);
    setError("");
    setEmailError("");

    if (!session || !session.userId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    if (!formData.dateOfBirth) {
      setError("Please select a valid date of birth");
      setLoading(false);
      return;
    }

    if (formData.nickname.length >= 10) {
      setError("Nickname must be less than 10 characters");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email");
      setLoading(false);
      return;
    }

    try {
      await updateUserInfo({ userId: session.userId, data: formData });
      setLoading(false);
      setDataChanged(false);
      queryClient.invalidateQueries({ queryKey: userKeys.info });

      if (!isProfilePrefilled) {
        router.push("/success");
      } else {
        router.back();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="pt-[72px] bg-gray600 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-md mx-auto bg-gradient-to-b from-gray500 to-transparent rounded-3xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8 border border-gray400 overflow-hidden">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {formData.profilePicture ? (
                    <Image
                      src={formData.profilePicture}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-600" />
                  )}
                </div>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
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
                    onChange={handleInputChange}
                    value={formData.nickname}
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray50"
                >
                  Area
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <Input
                    id="location"
                    name="location"
                    icon={<Location className="text-gray100" />}
                    placeholder="Area"
                    onChange={handleInputChange}
                    value={formData.location}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray50"
                >
                  Birthday
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    icon={<Cake className="text-gray100" />}
                    placeholder="Birthday"
                    onChange={handleInputChange}
                    type="date"
                    value={formData.dateOfBirth}
                  />
                </div>
                {formData.dateOfBirth && (
                  <p className="mt-1 text-sm text-gray100">
                    {formatDate(formData.dateOfBirth)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <Button
                variant={dataChanged ? 'primary' : 'secondary'}
                className="w-full justify-between"
                onClick={triggerUpdateUser}
                disabled={!dataChanged || loading}
              >
                <span className="justify-center flex w-full">
                  <p>{loading ? "Saving..." : "Save Changes"}</p>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfileEdit;