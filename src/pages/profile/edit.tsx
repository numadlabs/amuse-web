import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Sms, User } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";
import AuthenticatedLayout from "@/components/layout/layout";
import { Input } from "@/components/ui/input";

interface FormData {
  nickname: string;
  email: string;
}

const ProfileEdit = () => {
  const { data: session } = useSession();

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

  return (
    <AuthenticatedLayout>
      <div className="pt-[72px] bg-gray600 py-12 overflow-hidden">
        <div className="max-w-md mx-auto bg-gradient-to-b from-gray500 to-transparent rounded-3xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8 border border-gray400 overflow-hidden">
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
            </div>

            <div className="mt-8">
              <Button
                variant="secondary"
                className="w-full justify-between"
                disabled
              >
                <span className="justify-center flex w-full">
                  <p>Profile Editing Disabled</p>
                </span>
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray100">
              <p>
                To access full profile editing features, please use our mobile
                app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProfileEdit;
