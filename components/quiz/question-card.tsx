'use client'

import { motion } from 'framer-motion'
import { TextInput } from './inputs/text-input'
import { SliderInput } from './inputs/slider-input'
import { YesNoInput } from './inputs/yes-no-input'
import { MultipleChoiceInput } from './inputs/multiple-choice-input'
import type { Question, AnswerValue, YesNoAnswer, MultipleChoiceAnswer, SliderConfig, TextConfig, YesNoConfig, MultipleChoiceConfig } from '@/types/quiz'

interface QuestionCardProps {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
  direction: 'forward' | 'back'
  custom?: { x: number; opacity: number }
  animate?: { x: number; opacity: number }
  exit?: { x: number; opacity: number }
}

const variants = {
  enter: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '60%' : '-60%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '-60%' : '60%',
    opacity: 0,
  }),
}

export function QuestionCard({ question, value, onChange, direction }: QuestionCardProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextInput
            value={(value as string) ?? ''}
            onChange={onChange}
            config={question.config as TextConfig}
          />
        )
      case 'slider': {
        const cfg = question.config as SliderConfig
        return (
          <SliderInput
            value={(value as number) ?? cfg.min}
            onChange={onChange}
            config={cfg}
          />
        )
      }
      case 'yes-no':
        return (
          <YesNoInput
            value={(value as YesNoAnswer) ?? { value: undefined as unknown as boolean }}
            onChange={onChange}
            config={question.config as YesNoConfig}
          />
        )
      case 'multiple-choice':
        return (
          <MultipleChoiceInput
            value={(value as MultipleChoiceAnswer) ?? { selected: '' }}
            onChange={onChange}
            config={question.config as MultipleChoiceConfig}
          />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      key={question.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 30,
        mass: 0.8,
      }}
      className="w-full"
    >
      <div className="mb-8">
        {/* Question number + emoji */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{question.emoji}</span>
          <span className="text-dumpd-subtle text-sm font-medium">
            Question {question.step}
          </span>
        </div>

        {/* Question text */}
        <h2 className="font-clash text-2xl md:text-3xl font-bold text-dumpd-white mb-2 leading-snug">
          {question.prompt}
        </h2>

        {/* Subtext */}
        {question.subtext && (
          <p className="text-dumpd-muted text-sm">{question.subtext}</p>
        )}
      </div>

      {/* Input */}
      <div className="w-full">
        {renderInput()}
      </div>
    </motion.div>
  )
}
