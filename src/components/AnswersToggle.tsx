'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface AnswersToggleProps {
  answersExplanation?: string;
}

export default function AnswersToggle({ answersExplanation }: AnswersToggleProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const t = useTranslations('BlogPost');

  if (!answersExplanation) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowAnswers(!showAnswers)}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {showAnswers ? 'Hide Answers' : t('revealAnswers')}
      </button>

      <AnimatePresence>
        {showAnswers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div>
              <h3 style={{ color: 'var(--text-primary)' }}>{t('answersExplanation')}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {answersExplanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
