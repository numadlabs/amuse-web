import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Cake, Camera, Location, Sms, User } from "iconsax-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getUserById } from '@/lib/service/queryHelper';
import { userKeys } from '@/lib/service/keysHelper';
import { updateUserInfo } from '@/lib/service/mutationHelper';
import AuthenticatedLayout from '@/components/layout/layout';
import { Input } from '@/components/ui/input';

const ProfileEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();


  const { data: user = [] } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => getUserById(session?.userId),
  });


  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dataChanged, setDataChanged] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isProfilePrefilled = user?.user?.email && user?.user?.location && user?.user?.dateOfBirth;

  // useEffect(() => {
  //   if (user) {
  //     setNickname(user.user.nickname || '');
  //     setEmail(user.user.email || '');
  //     setLocation(user.user.location || '');
  //     setDateOfBirth(user.user.dateOfBirth || '');
  //   }
  // }, [user]);

  // useEffect(() => {
  //   setDataChanged(
  //     user?.user?.nickname !== nickname ||
  //     user?.user?.profilePicture !== profilePicture ||
  //     user?.user?.location !== location ||
  //     user?.user?.dateOfBirth !== dateOfBirth
  //   );
  // }, [user, nickname, email, location, dateOfBirth, profilePicture]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpdateUser = async () => {
    setLoading(true);
    setError('');
    setEmailError('');

    const emojiRegex = /\p{Emoji}/u;

    if (!dateOfBirth) {
      setError('Please select a valid date of birth');
      setLoading(false);
      return;
    }

    if (nickname.length >= 10) {
      setError('Nickname must be less than 10 characters');
      setLoading(false);
      return;
    }

    if (emojiRegex.test(nickname)) {
      setError('Nickname cannot contain emojis');
      setLoading(false);
      return;
    }

    if (emojiRegex.test(email)) {
      setEmailError('Email cannot contain emojis');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email');
      setLoading(false);
      return;
    }

    const userData = {
      nickname,
      location,
      dateOfBirth,
      profilePicture,
    };

    try {
      await updateUserInfo({ userId: session.userId, data: userData });
      setLoading(false);
      setDataChanged(false);
      queryClient.invalidateQueries({ queryKey: userKeys.info });

      if (!isProfilePrefilled) {
        router.push('/success');
      } else {
        router.back();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray600 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-md mx-auto bg-gradient-to-b from-gray500 to-transparent rounded-3xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8 border border-gray400 overflow-hidden">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {profilePicture ? (
                    <Image src={profilePicture} alt="Profile" width={96} height={96} className="object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-600" />
                  )}
                </div>
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer">
                  <Camera className="w-4 h-4 text-white" />
                  <input id="profile-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray50">Nickname</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <Input id='nickname' icon={(<User className='text-gray100' />)} placeholder="Username" onChange={(e) => setNickname(e.target.value)} value={nickname} />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray50">Email</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <Input id='email' icon={(<Sms className='text-gray100' />)} placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
                {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray50">Area</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <Input id='location' icon={(<Location className='text-gray100' />)} placeholder="Area" onChange={(e) => setLocation(e.target.value)} value={location} />
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray50">Birthday</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <Input id='dateOfBirth' icon={(<Cake className='text-gray100' />)} placeholder="Birthday" onChange={(e) => setDateOfBirth(e.target.value)} type='date' value={dateOfBirth} />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                variant="primary"
                className="w-full justify-between"
                onClick={() => router.push("profile/profile-edit")}
              >
                <p>
                  Save Changes
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  );
};

export default ProfileEdit;