"use client"

import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardSessionProps {
  currentQuestion: any;
  selectedAnswer: string | null;
  setSelectedAnswer: (value: string | null) => void;
  isCorrect: boolean | null;
  handleNext: () => void;
  handlePrevious: () => void;
  currentQuestionIndex: number;
}

export function FlashcardSession({
  currentQuestion,
  selectedAnswer,
  setSelectedAnswer,
  isCorrect,
  handleNext,
  handlePrevious,
  currentQuestionIndex,
}: FlashcardSessionProps) {

  return (
    <div className="mx-auto max-w-3xl w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
      </div>
      <RadioGroup
        value={selectedAnswer || undefined}
        onValueChange={setSelectedAnswer}
        className="space-y-4"
        disabled={isCorrect !== null}
      >
        {Object.entries(currentQuestion.options).map(([key, value]) => {
          const isSelected = selectedAnswer === key;
          const isCorrectAnswer = key === currentQuestion.correctAnswer;
          
          return (
             <div key={key}>
              <RadioGroupItem value={key} id={`option-${key}`} className="peer sr-only" />
              <Label
                htmlFor={`option-${key}`}
                className={cn(
                  "flex items-center gap-4 rounded-md bg-accent p-4 cursor-pointer",
                  isSelected && "bg-[#2C7BF2] text-accent",
                  isCorrect === true && isSelected && "border-green-600 bg-green-300 text-primary",
                  isCorrect === false && isSelected && "border-2 border-red-600 bg-red-200 text-primary",
                  isCorrect !== null && isCorrectAnswer && "border-2 border-green-600 bg-green-200 text-primary"
                )}
              >
                <span className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full font-semibold",
                   isCorrect !== null ? isCorrectAnswer ? "bg-green-600 text-green-600" : isSelected ? "bg-red-600 text-red-600" : "bg-[#E2ECF3] text-[#2C7BF2]" : "bg-[#E2ECF3] text-[#2C7BF2]"
                )}>
                  {isCorrect !== null ? (isCorrectAnswer ? <Check className="h-5 w-5 text-green-200" /> : isSelected ? <X className="h-5 w-5 text-red-200" /> : key) : key}
                </span>
                <span>{value as string}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Sebelumnya
        </Button>
        <Button onClick={handleNext} className="bg-[#2C7BF2] hover:bg-[#1e5cb8]" disabled={!selectedAnswer}>
          Selanjutnya
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

    </div>
  );
}