'use client';

import { useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    handleRedirectCallback({
      redirectUrl: '/dashboard',
    })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Error handling redirect:', err);
        navigate('/signin');
      });
  }, [handleRedirectCallback, navigate]);
  useEffect(() => {
    if (user) {
      redirect('/');
    }
  }, [user]);

  return (
    <div className='min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-br from-yellow/20 to-orange/20'>
      <div className='text-center flex flex-col items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-orange mx-auto mb-4' />
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Signing In</h1>
          <p className='text-gray-600'>Just a moment while we get everything ready for you.</p>
        </div>
      </div>
    </div>
  );
}
