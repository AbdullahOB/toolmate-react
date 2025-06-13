import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wrench, XCircle } from 'lucide-react';
interface ExplanationModalProps {
  showExplanationModal: boolean;
  setShowExplanationModal: (value: boolean) => void;
  currentToolName: string;
  currentExplanation: string;
}
const ExplanationModal: React.FC<ExplanationModalProps> = ({
  showExplanationModal,
  setShowExplanationModal,
  currentToolName,
  currentExplanation,
}) => {
  return (
    <AnimatePresence>
      {showExplanationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => {
            setShowExplanationModal(false);
          }}>
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className='bg-white rounded-2xl p-5 max-w-md w-full shadow-xl border-2 border-yellow'
            style={{ borderRadius: '20px 40px 20px 40px' }}
            onClick={(e) => e.stopPropagation()}>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-yellow p-2 rounded-full'>
                  <Wrench className='text-white' size={20} />
                </div>
                <h3 className='font-bold text-xl'>Why this tool?</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className='text-gray-500 hover:text-gray-700'
                onClick={() => setShowExplanationModal(false)}>
                <XCircle size={24} />
              </motion.button>
            </div>

            <div className='mt-6'>
              <h4 className='font-semibold text-lg text-yellow-600 mb-2'>{currentToolName}</h4>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <p className='text-gray-700'>{currentExplanation}</p>
              </motion.div>
            </div>

            <motion.div
              className='mt-3 flex justify-end'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-4 py-2 bg-yellow text-white rounded-full font-medium'
                onClick={() => setShowExplanationModal(false)}>
                Got it
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExplanationModal;
