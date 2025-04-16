
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Sample quiz data (would come from API in real app)
const quizData = {
  "1": {
    title: "Basic Mathematics",
    description: "Test your math knowledge with these basic questions",
    questions: [
      {
        id: "q1",
        text: "What is 2 + 2?",
        type: "single",
        options: [
          { id: "q1-o1", text: "3", isCorrect: false },
          { id: "q1-o2", text: "4", isCorrect: true },
          { id: "q1-o3", text: "5", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Which of these are prime numbers?",
        type: "multiple",
        options: [
          { id: "q2-o1", text: "2", isCorrect: true },
          { id: "q2-o2", text: "4", isCorrect: false },
          { id: "q2-o3", text: "7", isCorrect: true },
          { id: "q2-o4", text: "9", isCorrect: false },
        ],
      },
    ],
  },
  "2": {
    title: "World Geography",
    description: "Test your knowledge of world geography",
    questions: [
      {
        id: "q1",
        text: "What is the capital of France?",
        type: "single",
        options: [
          { id: "q1-o1", text: "London", isCorrect: false },
          { id: "q1-o2", text: "Berlin", isCorrect: false },
          { id: "q1-o3", text: "Paris", isCorrect: true },
        ],
      },
      {
        id: "q2",
        text: "Which of these countries are in Europe?",
        type: "multiple",
        options: [
          { id: "q2-o1", text: "Spain", isCorrect: true },
          { id: "q2-o2", text: "Egypt", isCorrect: false },
          { id: "q2-o3", text: "Italy", isCorrect: true },
          { id: "q2-o4", text: "Japan", isCorrect: false },
        ],
      },
      {
        id: "q3",
        text: "What is the largest continent?",
        type: "single",
        options: [
          { id: "q3-o1", text: "Europe", isCorrect: false },
          { id: "q3-o2", text: "Asia", isCorrect: true },
          { id: "q3-o3", text: "Africa", isCorrect: false },
        ],
      },
    ],
  },
  "3": {
    title: "Science: Elements",
    description: "Test your knowledge of chemical elements",
    questions: [
      {
        id: "q1",
        text: "What is the chemical symbol for Gold?",
        type: "single",
        options: [
          { id: "q1-o1", text: "Go", isCorrect: false },
          { id: "q1-o2", text: "Au", isCorrect: true },
          { id: "q1-o3", text: "Ag", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Which of these are noble gases?",
        type: "multiple",
        options: [
          { id: "q2-o1", text: "Helium", isCorrect: true },
          { id: "q2-o2", text: "Oxygen", isCorrect: false },
          { id: "q2-o3", text: "Neon", isCorrect: true },
          { id: "q2-o4", text: "Sodium", isCorrect: false },
        ],
      },
    ],
  },
};

const PreviewQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  
  // Get quiz data based on quiz ID from URL
  const quiz = quizId ? quizData[quizId as keyof typeof quizData] : null;
  
  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  const handleSingleAnswer = (questionId: string, optionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };
  
  const handleMultipleAnswer = (questionId: string, optionId: string, checked: boolean) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    
    if (checked) {
      setAnswers({
        ...answers,
        [questionId]: [...currentAnswers, optionId],
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: currentAnswers.filter(id => id !== optionId),
      });
    }
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach(question => {
      if (question.type === "single") {
        // For single-choice questions
        const correctOptionId = question.options.find(o => o.isCorrect)?.id;
        if (answers[question.id] === correctOptionId) {
          correctAnswers++;
        }
      } else {
        // For multiple-choice questions
        const selectedOptions = answers[question.id] as string[] || [];
        const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
        
        // Check if selected options match correct options exactly
        if (
          selectedOptions.length === correctOptions.length &&
          correctOptions.every(id => selectedOptions.includes(id))
        ) {
          correctAnswers++;
        }
      }
    });
    
    return {
      score: correctAnswers,
      total: quiz.questions.length,
      percentage: Math.round((correctAnswers / quiz.questions.length) * 100)
    };
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const isQuestionAnswered = (questionId: string, type: string) => {
    if (type === "single") {
      return !!answers[questionId];
    } else {
      return (answers[questionId] as string[] || []).length > 0;
    }
  };
  
  if (showResults) {
    const result = calculateScore();
    
    return (
      <div className="max-w-2xl mx-auto py-6">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 -ml-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="bg-white">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold">Quiz Results</h1>
            <p className="text-muted-foreground">{quiz.title}</p>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col items-center py-8">
              <div className="h-32 w-32 rounded-full bg-quiz-light flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-quiz-primary">
                  {result.percentage}%
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-1">
                You scored {result.score} out of {result.total}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {result.percentage >= 80
                  ? "Excellent work!"
                  : result.percentage >= 60
                  ? "Good job!"
                  : "Keep practicing!"}
              </p>
              
              <div className="w-full max-w-md py-2">
                <Progress value={result.percentage} className="h-3" />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Review Answers
            </Button>
            <Button onClick={() => navigate("/")}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 -ml-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">{currentQuestion.text}</h2>
              
              {currentQuestion.type === "single" ? (
                <RadioGroup
                  value={answers[currentQuestion.id] as string || ""}
                  onValueChange={(value) =>
                    handleSingleAnswer(currentQuestion.id, value)
                  }
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-start space-x-3 border rounded-md p-3"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isChecked = (
                      (answers[currentQuestion.id] as string[]) || []
                    ).includes(option.id);
                    
                    return (
                      <div
                        key={option.id}
                        className="flex items-start space-x-3 border rounded-md p-3"
                      >
                        <Checkbox
                          id={option.id}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleMultipleAnswer(
                              currentQuestion.id,
                              option.id,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isQuestionAnswered(currentQuestion.id, currentQuestion.type)}
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Finish
                <CheckCircle2 className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreviewQuiz;
