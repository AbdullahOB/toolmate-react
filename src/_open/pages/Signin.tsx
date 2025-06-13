'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, EyeOff, Loader2, Facebook } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignIn, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import type { z } from 'zod';
import LoadingPage from '@/components/custom/LoadingPage';
import { BorderBeam } from '@/components/magicui/border-beam';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoaded: userLoaded } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) {
      toast({
        title: 'Please wait',
        description: 'Authentication is still loading.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Use Clerk's signIn functionality
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === 'complete') {
        // Set the active session
        await setActive({ session: result.createdSessionId });

        toast({
          title: 'Welcome back',
          description: "You've successfully signed in.",
        });

        // Navigate to home or dashboard
        navigate('/');
      } else {
        console.error('Sign in failed', result);
        setError('Something went wrong. Please try again.');
        toast({
          title: 'Sign in failed',
          description: 'Something went wrong with your sign in.',
          variant: 'destructive',
        });
      }
    } catch (err: unknown) {
      console.error('Error signing in:', err);
      let errorMessage = "We couldn't sign you in. Check your details and try again.";
      interface ClerkError {
        errors?: { message?: string }[];
      }
      if (typeof err === 'object' && err !== null && 'errors' in err && Array.isArray((err as ClerkError).errors)) {
        errorMessage = (err as ClerkError).errors?.[0]?.message || errorMessage;
      }
      setError(errorMessage);
      toast({
        title: 'Sign in failed',
        description: errorMessage || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'oauth_google' | 'oauth_facebook') => {
    if (!isLoaded) {
      toast({
        title: 'Please wait',
        description: 'Authentication is still loading.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSocialLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err: unknown) {
      console.error(`Error signing in with ${provider}:`, err);
      toast({
        title: 'Social sign in failed',
        description: "We couldn't sign you in. Please try again.",
        variant: 'destructive',
      });
      setSocialLoading(null);
    }
  };
  return userLoaded ? (
    <div className='md:min-h-screen max-w-7xl mx-auto flex flex-col md:flex-row bg-gray-50 pt-16'>
      {/* Left side - illustration and content */}
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        className='relative w-full md:w-1/2 p-4 md:p-12 flex flex-col pt-56 justify-center items-center bg-gray-50 overflow-hidden'>
        <div className='mx-auto relative z-10'>
          <div className='bg-gradient-to-bl from-paleYellow to-white rounded-lg px-4 py-6 shadow-lg border border-gray-200'>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='text-center md:text-left'>
              <div className='flex justify-center md:justify-start'>
                <h1 className='text-5xl md:text-6xl font-bold mb-4 text-gray-900 leading-tight'>
                  G'day, <span className='text-orange'> Mate!</span>
                </h1>
              </div>
              <p className='text-xl md:text-2xl mb-4 text-gray-600 leading-relaxed font-medium'>
                Good to have ya back, mate
              </p>
              <p className='text-base md:text-lg mb-6 text-gray-600 leading-relaxed'>
                Your trusty DIY sidekick's been waitin' for ya return. Got some ripper projects ready for when you're
                all set.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className='text-center md:text-left'>
              <p className='text-lg text-orange italic'>"She'll be right with Matey by your side!"</p>
            </motion.div>
            <BorderBeam colorFrom='orange' colorTo='yellow' size={150} duration={6} />
          </div>
          {/* Image behind the card */}
          <motion.img
            initial={{ scale: 0.8, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 20, damping: 5, delay: 0.3 }}
            src='/assets/matey/wavy.svg'
            alt='Matey Illustration'
            className=' h-[400px] pointer-events-none select-none absolute bottom-20 object-cover'
            style={{ zIndex: -1 }}
          />
        </div>
      </motion.div>

      {/* Right side - Sign-in form */}
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
                <MessageCircle className='h-6 w-6 text-orange' />
              </motion.div>
            </div>
            <CardTitle className='text-xl font-semibold text-center text-gray-900'>Let’s get stuck in, mate</CardTitle>
            <CardDescription className='text-center text-gray-500'>
              Chuck in your deets and we’ll get back to it.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm'>
                {error}
              </motion.div>
            )}
            {/* Sign in form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
              <div className='space-y-1 flex flex-col items-start'>
                <Label htmlFor='identifier' className='text-base font-medium text-gray-700'>
                  Email
                </Label>
                <Input
                  id='identifier'
                  type='email'
                  {...register('identifier')}
                  className={`h-10  ${
                    errors.identifier ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-400'
                  }`}
                  placeholder='your.email@example.com'
                />
                {errors.identifier && <p className='text-sm text-red-500 mt-1'>{errors.identifier.message}</p>}
              </div>

              <div className='space-y-1'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password' className='text-base font-medium text-gray-700'>
                    Password
                  </Label>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`h-10 pr-10 ${
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

              <Button
                type='submit'
                disabled={isLoading || !isLoaded}
                className='w-full h-10 bg-orange hover:bg-orange/80 text-lg text-white font-semibold transition-all duration-300'>
                {isLoading ? (
                  <span className='flex items-center justify-center'>
                    <Loader2 className='animate-spin mr-2 h-4 w-4' />
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
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
                onClick={() => handleSocialSignIn('oauth_google')}
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
                onClick={() => handleSocialSignIn('oauth_facebook')}
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
              Don't have an account?{' '}
              <Link to='/signup' className='font-medium text-orange hover:underline'>
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  ) : (
    <LoadingPage title='loading' />
  );
}

// function AussieFact({ title, fact }: { title: string; fact: string }) {
//     return (
//         <motion.div whileHover={{ x: 5 }} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
//             <h2 className="font-bold text-gray-800 mb-1 text-2xl font-lato">{title}</h2>
//             <p className="text-gray-600 text-lg leading-relaxed text-justify font-inter">{fact}</p>
//         </motion.div>
//     )
// }
