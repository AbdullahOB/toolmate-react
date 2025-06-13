'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderPinwheel, X } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

interface ReportBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  closeExtraPart: () => void;
  messageTimestamp: string;
  messageText: string;
}

export function ReportModal({
  isOpen,
  onClose,
  messageId,
  closeExtraPart,
  messageTimestamp,
  messageText,
}: ReportBottomSheetProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setFeedback] = useState(false);
  const { user } = useUser();
  const reportReasons = [
    'Wrong or dodgy info',
    'Safety advice was off',
    'Hard to follow',
    'Off-topic',
    'Something else',
  ];

  const handleReasonToggle = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0) {
      return;
    }
    setFeedback(true);
    try {
      const payload = {
        messageId,
        messageText,
        messageTimestamp,
        feedback: {
          reasons: selectedReasons,
          otherReason,
        },
        isLoggedInUser: !!user,
        ...(user && {
          name: user.fullName,
          email: user.emailAddresses.map((email) => email.emailAddress),
        }),
        reportStatus: true,
      };
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/add-feedback`, payload);
      console.log(res.data?.message);
    } catch (err) {
      console.error('Feedback submission error:', err);
    } finally {
      setFeedback(false);
    }
    setSelectedReasons([]);
    setOtherReason('');
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onClose();
      closeExtraPart();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className='fixed inset-0 z-[10000] bg-black/5'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className='fixed bottom-0 left-0 right-0 z-[10000] bg-white rounded-t-2xl transform-gpu'
            initial={{ translateY: '100%' }}
            animate={{ translateY: 0 }}
            exit={{ translateY: '100%' }}
            transition={{
              duration: 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}>
            {/* Handle */}
            <div className='flex justify-center pt-3 pb-2'>
              <div className='w-10 h-1 bg-gray-300 rounded-full' />
            </div>

            {/* Header */}
            <div className='flex justify-between items-center px-4 pb-4'>
              <h3 className='text-lg text-red-600 font-semibold'>What went wrong?</h3>
              <button onClick={onClose} className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className='px-4 pb-6 max-h-[70vh] overflow-y-auto'>
              <div className='space-y-4'>
                {reportReasons.map((reason) => (
                  <div
                    key={reason}
                    className='flex items-center
                  '>
                    <div
                      className={`w-5 h-5 rounded cursor-pointer border flex-shrink-0 mr-3 flex items-center justify-center transition-colors ${
                        selectedReasons.includes(reason) ? 'bg-yellow border-yellow' : 'border-gray-300'
                      }`}
                      onClick={() => handleReasonToggle(reason)}>
                      {selectedReasons.includes(reason) && (
                        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M10 3L4.5 8.5L2 6'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      )}
                    </div>
                    <label
                      className='text-sm md:text-md cursor-pointer text-start select-none flex-1 py-2'
                      onClick={() => handleReasonToggle(reason)}>
                      {reason}
                    </label>
                  </div>
                ))}
              </div>

              {selectedReasons.includes('Something else') && (
                <div className='mt-4'>
                  <textarea
                    className='w-full p-3 border border-gray-300 rounded-lg text-sm md:text-md'
                    rows={3}
                    placeholder='Please describe the issue...'
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </div>
              )}

              <button
                className={`w-full flex justify-center items-center text-xl gap-1 mt-6 py-3 px-4 rounded-lg font-medium shadow-sm transition-colors ${
                  selectedReasons.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow text-white hover:bg-darkYellow'
                }`}
                onClick={handleSubmit}
                disabled={selectedReasons.length === 0}>
                {loading ? <LoaderPinwheel className=' text-gray-500 animate-spin min-w-5 max-w-5 max-h-5' /> : ''}
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              {/* Confirmation Window */}
              {showConfirmation && (
                <motion.div
                  className='fixed inset-0 z-[10001] flex items-center justify-center'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  <div className='bg-white rounded-lg p-6 mx-4 shadow-lg border'>
                    <div className='text-center'>
                      <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M20 6L9 17L4 12'
                            stroke='#10B981'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                      <h4 className='text-lg font-semibold text-gray-900 mb-2'>Report Sent!</h4>
                      <p className='text-sm text-gray-600'>
                        Cheers for the feedback! Matey and the crew’ll take a squiz when they get a chance.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
