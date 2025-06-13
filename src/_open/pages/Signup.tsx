'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockIcon, AlertCircle, Eye, EyeOff, Loader2, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { z } from 'zod';
import { signUpSchema } from '@/schemas/signUpSchema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import LoadingPage from '@/components/custom/LoadingPage';
import { BorderBeam } from '@/components/magicui/border-beam';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: userLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({ emailAddress: data.email, password: data.password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } catch (error: unknown) {
      console.error('Signup error: ', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        setAuthError(
          (error as { errors?: { message?: string }[] }).errors?.[0]?.message ||
            'An error occurred during signup. Please try again.'
        );
      } else {
        setAuthError('An error occurred during signup. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignUp = async (provider: 'oauth_google' | 'oauth_facebook') => {
    if (!isLoaded) return;
    try {
      setSocialLoading(provider);
      setAuthError(null);

      // Start the OAuth flow with the selected provider
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error: unknown) {
      console.error(`Error signing up with ${provider}:`, error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        setAuthError(
          (error as { errors?: { message?: string }[] }).errors?.[0]?.message ||
            `An error occurred during ${provider === 'oauth_google' ? 'Google' : 'Facebook'} sign up.`
        );
      } else {
        setAuthError(`An error occurred during ${provider === 'oauth_google' ? 'Google' : 'Facebook'} sign up.`);
      }
      setSocialLoading(null);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/dashboard');
      } else {
        console.error('Verification incomplete', result);
        setVerificationError('Verification could not be completed.');
      }
    } catch (error: unknown) {
      console.error('Verification error: ', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        setVerificationError(
          (error as { errors?: { message?: string }[] }).errors?.[0]?.message || 'An error occurred. Please try again.'
        );
      } else {
        setVerificationError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userLoaded) {
    return <LoadingPage title='loading' />;
  }

  if (verifying) {
    return (
      <div className='min-h-screen pt-20 flex justify-center items-center bg-gray-50 px-4'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className='w-full max-w-md border-gray-200 shadow-sm'>
            <CardHeader className='space-y-1'>
              <div className='flex justify-center mb-2'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                  className='w-12 h-12 rounded-full bg-lightYellow flex items-center justify-center'>
                  <Mail className='h-6 w-6 text-orange' />
                </motion.div>
              </div>
              <div className='flex justify-center'>
                <CardTitle className='text-xl font-semibold text-gray-900'>Check your email</CardTitle>
              </div>
              <CardDescription className='text-center text-gray-500'>
                We've sent a verification code to your email
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {verificationError && (
                <div className='bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-center gap-2 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <p>{verificationError}</p>
                </div>
              )}

              <form onSubmit={handleVerificationSubmit} className='space-y-4'>
                <div className='space-y-1'>
                  <Label htmlFor='verificationCode' className='text-base font-medium text-gray-700'>
                    Verification Code
                  </Label>
                  <Input
                    type='text'
                    id='verificationCode'
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder='Enter the 6-digit code'
                    className='h-10 border-gray-300 focus:ring-gray-400'
                    autoFocus
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full h-10 bg-orange hover:bg-orange/80 text-lg text-white font-semibold transition-all duration-300'
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>

              <p className='text-sm text-center text-gray-600 mt-4'>
                Didn't receive a code?{' '}
                <button
                  type='button'
                  onClick={async () => {
                    if (signUp) {
                      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                    }
                  }}
                  className='text-orange hover:underline font-medium'>
                  Resend code
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='md:min-h-screen max-w-7xl mx-auto flex flex-col md:flex-row bg-gray-50 pt-16'>
      {/* Left side - content */}
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        className='relative w-full md:w-1/2 p-4 md:p-12 flex flex-col pt-52 justify-center items-center bg-gray-50 overflow-hidden'>
        <div className='mx-auto relative z-10'>
          <div className='bg-gradient-to-tr from-paleYellow to-white rounded-lg px-4 py-6 shadow-lg border border-gray-200'>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='text-center md:text-left'>
              <h1 className='text-5xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight'>
                <span className='text-orange'>Stoked</span> to have ya here!
              </h1>
              <p className='text-xl md:text-2xl mb-4 text-gray-600 leading-relaxed font-medium'>
                Whether it’s your first fix or your fiftieth, I’m here to steer ya right.
              </p>
              <p className='text-base md:text-lg mb-6 text-gray-600 leading-relaxed'>
                Chuck your details in and we’ll be ready to roll. Let’s find your first job and get stuck in.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className='text-center md:text-left'>
              <p className='text-lg text-orange italic'>"Too easy, mate! Let’s get this show on the road!"</p>
            </motion.div>
            <BorderBeam colorFrom='orange' colorTo='yellow' size={150} duration={6} />
          </div>
          {/* Image behind the card */}
          <motion.img
            initial={{ scale: 0.8, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 20, damping: 5, delay: 0.3 }}
            src='/assets/matey/langingMatey.svg'
            alt='Matey Illustration'
            className='h-[500px] pointer-events-none select-none absolute bottom-28 md:bottom-20 -left-8 md:-left-32 object-cover'
            style={{ zIndex: -1 }}
          />
        </div>
      </motion.div>

      {/* Right side - Sign-up form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='w-full md:w-1/2 bg-gray-50 p-4 md:p-12 flex items-center justify-center'>
        <Card className='w-full max-w-md border-gray-200 shadow-sm'>
          <CardHeader className='space-y-1 flex flex-col items-center'>
            <div className='flex justify-center mb-2'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
                className='w-12 h-12 rounded-full bg-lightYellow flex items-center justify-center'>
                <Mail className='h-6 w-6 text-orange' />
              </motion.div>
            </div>
            <CardTitle className='text-xl font-semibold text-center text-gray-900'>Keen to get started?</CardTitle>
            <CardDescription className='text-center text-gray-500'>
              Just say the word, I’ll get ya sorted.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm'>
                {authError}
              </motion.div>
            )}

            {/* Sign up form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
              <div className='space-y-1 flex flex-col items-start'>
                <Label htmlFor='email' className='text-base font-medium text-gray-700'>
                  Email
                </Label>
                <div className='relative w-full'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <Input
                    type='email'
                    id='email'
                    {...register('email')}
                    className={`pl-10 h-10 w-full ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-400'
                    }`}
                    placeholder='your.email@example.com'
                  />
                </div>
                {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
              </div>

              <div className='space-y-1'>
                <div className='flex items-start justify-between'>
                  <Label htmlFor='password' className='text-base font-medium text-gray-700'>
                    Password
                  </Label>
                </div>
                <div className='relative'>
                  <LockIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    {...register('password')}
                    className={`pl-10 pr-10 h-10 ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-400'
                    }`}
                    placeholder='••••••••'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>}
              </div>

              <div className='space-y-1'>
                <div className='flex items-start justify-between'>
                  <Label htmlFor='passwordConfirmation' className='text-base font-medium text-gray-700'>
                    Confirm Password
                  </Label>
                </div>
                <div className='relative'>
                  <LockIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='passwordConfirmation'
                    {...register('passwordConfirmation')}
                    className={`pl-10 pr-10 h-10 ${
                      errors.passwordConfirmation
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gray-400'
                    }`}
                    placeholder='••••••••'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'>
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.passwordConfirmation && (
                  <p className='text-sm text-red-500 mt-1'>{errors.passwordConfirmation.message}</p>
                )}
              </div>

              <div className='flex items-start gap-2 text-sm text-gray-600'>
                <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
              </div>

              <Button
                type='submit'
                className='w-full h-10 bg-orange hover:bg-orange/80 text-lg text-white font-semibold transition-all duration-300'
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <Loader2 className='animate-spin mr-2 h-4 w-4' />
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>
              <div className='relative flex justify-center text-base uppercase'>
                <span className='bg-gray-50 px-2 text-gray-500'>Prefer the easy route?</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className='flex gap-5'>
              <Button
                type='button'
                variant='outline'
                className='w-full h-10 text-base font-medium border-gray-300 text-gray-700 hover:bg-amber-50 transition-all group'
                onClick={() => handleSocialSignUp('oauth_google')}
                disabled={!!socialLoading}>
                <span className='flex items-center justify-center text-lg gap-2'>
                  {socialLoading === 'oauth_google' ? (
                    <Loader2 className='h-6 w-6 animate-spin' />
                  ) : (
                    <svg className='h-6 w-6 group-hover:scale-125 transition-all duration-300' viewBox='0 0 24 24'>
                      <path
                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                        fill='#4285F4'
                      />
                      <path
                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                        fill='#34A853'
                      />
                      <path
                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                        fill='#FBBC05'
                      />
                      <path
                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                        fill='#EA4335'
                      />
                    </svg>
                  )}
                  {/* Google */}
                </span>
              </Button>

              <Button
                type='button'
                variant='outline'
                className='w-full h-10 text-base font-medium border-gray-300 text-gray-700 hover:bg-blue-50 group transition-all duration-300'
                onClick={() => handleSocialSignUp('oauth_facebook')}
                disabled={!!socialLoading}>
                <span className='flex items-center text-lg'>
                  {socialLoading === 'oauth_facebook' ? (
                    <Loader2 className='h-6 w-6 animate-spin' />
                  ) : (
                    <Facebook className='h-5 w-5 text-[#1877F2] group-hover:scale-125 transition-all duration-300' />
                  )}
                  {/* Facebook */}
                </span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className='flex justify-center border-t pt-4'>
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <Link to='/signin' className='font-medium text-orange hover:underline'>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
