"use client"

import React, { useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FlashcardSession } from "@/components/dashboard/flashcard-session";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge"


export default function Page() {
  const questions = [
    {
      question: "Jika ada 100 orang naik kereta api, dan 99 orang turun, berapa orang yang tersisa di dalam kereta?",
      options: {
        A: "1 orang",
        B: "99 orang",
        C: "100 orang",
        D: "Tidak ada orang yang tersisa",
      },
      correctAnswer: "C",
    },
    {
      question: "Apa yang lebih berat, 1 kg kapas atau 1 kg besi?",
      options: {
        A: "1 kg kapas",
        B: "1 kg besi",
        C: "Keduanya sama berat",
        D: "Tidak ada jawaban yang benar",
      },
      correctAnswer: "C",
    },
    {
      question: "Apa yang bisa dipecahkan, dibuat, dan diubah?",
      options: {
        A: "Pikiran",
        B: "Cermin",
        C: "Hati",
        D: "Masalah",
      },
      correctAnswer: "D",
    },
  ];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(2); // Contoh streak awal
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null); 
        setIsCorrect(null); 
      } else {
        setShowCompletionDialog(true);
      }
    }, 2000); 
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setStreak(2);
    setCorrectAnswers(0);
    setShowCompletionDialog(false);
  };

  const handleReturnToNotes = () => {
    window.history.back();
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 6)", 
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-4 lg:py-6">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex-1">
              <Progress value={progressValue} className="[&>div]:bg-[#2C7BF2]" />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <FlashcardSession 
                currentQuestion={currentQuestion}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                isCorrect={isCorrect}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                currentQuestionIndex={currentQuestionIndex}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2C7BF2]">
              <span className="flex justify-center text-6xl"> 
                    {Math.round((correctAnswers / questions.length) * 100)}%  
                  </span>
            </DialogTitle>
            <DialogDescription className="text-center text-primary">
              <span className="font-semibold text-md">
                Kamu menjawab 
                <Badge 
                  variant="secondary" className="font-semibold bg-accent text-green-600">  
                  {correctAnswers}
                </Badge>
                jawaban dengan benar. 
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row mx-auto">
            <Button 
              variant="outline" 
              onClick={handleReturnToNotes}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali 
            </Button>
            <Button 
              onClick={handleRestart}
              className="bg-[#2C7BF2] hover:bg-[#1e5cb8] flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Ulangi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

