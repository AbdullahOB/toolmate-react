import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Mail, Calendar, Hammer, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UserProfilePage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  // User data states
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: 'DIY enthusiast who loves working with my hands and fixing things around the house.',
    memberSince: new Date().toLocaleDateString(),
  });

  // Load user data
  useEffect(() => {
    if (isUserLoaded && user) {
      setUserData((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        memberSince: new Date(user.createdAt || Date.now()).toLocaleDateString(),
      }));
    }
  }, [isUserLoaded, user]);

  if (!isUserLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center pt-16'>
        <Loader2 className='h-8 w-8 animate-spin text-orange' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pt-14 md:pt-20 pb-10'>
      {/* Header Banner */}
      <div className='h-48 bg-gradient-to-r from-yellow to-orange relative'>
        <div className='absolute -bottom-16 left-1/2 transform -translate-x-1/2'>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Avatar className='h-32 w-32 border-4 border-white shadow-lg'>
              {user?.imageUrl ? (
                <AvatarImage
                  src={user.imageUrl || '/placeholder.svg'}
                  alt={`${userData.firstName} ${userData.lastName}`}
                />
              ) : (
                <AvatarFallback className='bg-orange-100 text-orange-600 text-4xl'>
                  {userData.firstName?.[0]}
                  {userData.lastName?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
          </motion.div>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className='container mx-auto px-4 mt-20'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}>
          <Card className='max-w-3xl mx-auto shadow-lg border-none overflow-hidden'>
            <CardContent className='p-0'>
              {/* Profile Header */}
              <div className='text-center p-6 pb-4'>
                <h1 className='text-3xl font-bold tracking-tight mt-2'>
                  {userData.firstName} {userData.lastName}
                </h1>

                <div className='flex justify-center gap-2 mt-4'>
                  <Badge className='bg-gradient-to-r from-yellow to-orange border-none text-white px-3 py-1 text-2xl'>
                    DIY Enthusiast
                  </Badge>
                  <Badge variant='outline' className='bg-white text-2xl'>
                    Matey Member
                  </Badge>
                </div>
              </div>

              {/* Bio Section */}
              <div className='px-6 py-4 bg-gray-50 border-t border-b'>
                <p className='text-gray-700 italic'>{userData.bio}</p>
              </div>

              {/* Contact Info */}
              <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InfoItem icon={<Mail className='h-5 w-5 text-orange' />} label='Email' value={userData.email} />
                <InfoItem
                  icon={<Calendar className='h-5 w-5 text-orange' />}
                  label='Member Since'
                  value={userData.memberSince}
                />
              </div>

              {/* Footer */}
              <div className='bg-gradient-to-r from-yellow/10 to-orange/10 p-6 text-center border-t'>
                <div className='flex items-center justify-center gap-2'>
                  <Hammer className='h-5 w-5 text-orange' />
                  <span className='text-gray-700 font-medium'>Ready for your next DIY project!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className='flex items-center'>
      <div className='mr-3'>{icon}</div>
      <div className='text-left'>
        <p className='text-sm text-gray-500'>{label}</p>
        <p className='font-medium'>{value}</p>
      </div>
    </div>
  );
}
