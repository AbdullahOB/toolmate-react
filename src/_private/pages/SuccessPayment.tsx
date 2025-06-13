import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CreditCard, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import MateyExpression from '@/components/custom/MateyExpression';
import axios from 'axios';
import { UserContext } from '@/context/userContext';
import { useToast } from '@/hooks/use-toast';
export default function SuccessPayment() {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [baToken, setBaToken] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [planData, setPlanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Update dimensions for Confetti on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setBaToken(queryParams.get('ba_token'));
    setSubscriptionId(queryParams.get('subscription_id'));

    // Hide confetti after 8 seconds
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch plan data and confirm subscription
  useEffect(() => {
    if (!baToken || !subscriptionId || !userData || requestSent) {
      return;
    }

    const data = JSON.parse(localStorage.getItem('paypalData') || '{}');
    if (data?.ba === baToken) {
      setPlanData(data);
    } else {
      console.error('BA token mismatch or missing paypalData in localStorage');
    }
  }, [baToken, subscriptionId, userData, requestSent]);

  useEffect(() => {
    async function confirmSubscription() {
      if (!planData) {
        console.error('Plan data is missing');
        return;
      }

      setIsLoading(true);
      try {
        const apiData = {
          subscriptionId: subscriptionId,
          planName: planData.Packname,
          ba: baToken,
          userId: userData?.id,
        };

        console.log('API Data being sent:', apiData);

        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/paymentConfirmationAndUpdate`, apiData);

        if (res.status === 200) {
          console.log('Subscription confirmed successfully:', res.data);
          localStorage.removeItem('paypalData');
          setRequestSent(true);
          toast({
            title: 'Success',
            description: 'Your subscription has been confirmed successfully.',
            variant: 'default',
          });
        } else {
          throw new Error(res.data.message || 'Unexpected error occurred');
        }
      } catch (error: any) {
        console.error('Error confirming subscription:', error.message);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (planData && !requestSent) {
      confirmSubscription();
    }
  }, [planData, baToken, subscriptionId, userData, requestSent]);

  return (
    <div className='min-h-screen w-full overflow-hidden bg-gradient-to-br from-paleYellow via-softYellow to-mangoYellow flex items-center justify-center p-4'>
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.05}
        />
      )}

      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute rounded-full bg-yellow/20 backdrop-blur-md'
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='relative z-10 w-full max-w-md'>
        <div className='backdrop-blur-lg bg-white/30 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20'>
          {/* Success icon animation */}
          <motion.div
            className='bg-gradient-to-r from-mangoYellow to-yellow h-32 flex items-center justify-center'
            initial={{ height: 0 }}
            animate={{ height: 120 }}
            transition={{ duration: 0.5 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className='bg-white rounded-full p-4 shadow-lg'>
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.7, delay: 0.5 }}>
                <CircleCheck size={40} className='text-yellow' />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className='p-6'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}>
            <div className='flex items-center justify-center gap-4 mb-6'>
              <div className='hidden sm:block'>
                <MateyExpression expression='2thumb' className='w-16 h-16' />
              </div>
              <div>
                <div className='flex justify-center sm:justify-start'>
                  <motion.h1
                    className='text-2xl font-bold text-slate-800'
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}>
                    Payment Successful!
                  </motion.h1>
                </div>
                <motion.p
                  className='text-slate-600'
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}>
                  Your subscription is now active
                </motion.p>
              </div>
            </div>

            <AnimatePresence>
              {planData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className='bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/50'>
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-semibold text-slate-700'>Subscription Details</h2>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className='text-yellow'>
                      <CreditCard size={20} />
                    </motion.div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-slate-600'>Plan:</span>
                      <span className='font-medium text-slate-800'>{planData.Packname}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-slate-600'>Price:</span>
                      <span className='font-medium text-slate-800'>{planData.price}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-slate-600'>Status:</span>
                      <span className='font-medium text-green-600'>Active</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                className='flex items-center justify-center gap-2 py-3 text-slate-700'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <LoaderCircle className='animate-spin' />
                <p>Processing your subscription...</p>
              </motion.div>
            )}

            <div className='space-y-3 mt-6'>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-3 px-4 bg-gradient-to-r from-yellow to-mangoYellow rounded-lg text-slate-800 font-semibold flex items-center justify-center gap-2 shadow-md'
                onClick={() => navigate('/dashboard')}>
                <CircleCheck size={20} />
                Go To Dashboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-3 px-4 bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg text-slate-700 font-medium flex items-center justify-center gap-2'
                onClick={() => navigate('/manage-subscription')}>
                <CreditCard size={20} />
                Manage Subscription
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
