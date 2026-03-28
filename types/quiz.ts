export type QuestionType = 'text' | 'slider' | 'yes-no' | 'multiple-choice'

export interface TextConfig {
  placeholder: string
  maxLength: number
  rows?: number
}

export interface SliderConfig {
  min: number
  max: number
  step: number
  emojis: Record<number, string>
  labels: { min: string; max: string }
  unit?: string
}

export interface YesNoConfig {
  yesLabel?: string
  noLabel?: string
  followUpPrompt?: string
}

export interface MultipleChoiceConfig {
  options: string[]
  allowCustom?: boolean
  customPlaceholder?: string
}

export type QuestionConfig =
  | TextConfig
  | SliderConfig
  | YesNoConfig
  | MultipleChoiceConfig

export interface Question {
  id: string
  step: number
  type: QuestionType
  prompt: string
  subtext?: string
  emoji?: string
  config: QuestionConfig
  required: boolean
}

export type TextAnswer = string
export type SliderAnswer = number
export type YesNoAnswer = { value: boolean; followup?: string }
export type MultipleChoiceAnswer = { selected: string; custom?: string }

export type AnswerValue =
  | TextAnswer
  | SliderAnswer
  | YesNoAnswer
  | MultipleChoiceAnswer

export type Answers = Record<string, AnswerValue>
