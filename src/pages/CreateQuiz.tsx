
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Question {
  id: string;
  text: string;
  type: "multiple" | "single";
  options: { id: string; text: string; isCorrect: boolean }[];
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      text: "",
      type: "single",
      options: [
        { id: "o1", text: "", isCorrect: false },
        { id: "o2", text: "", isCorrect: false },
      ],
    },
  ]);
  
  const addQuestion = () => {
    const newId = `q${questions.length + 1}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        text: "",
        type: "single",
        options: [
          { id: `${newId}-o1`, text: "", isCorrect: false },
          { id: `${newId}-o2`, text: "", isCorrect: false },
        ],
      },
    ]);
  };
  
  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    } else {
      toast.error("You must have at least one question");
    }
  };
  
  const updateQuestionText = (questionId: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, text } : q))
    );
  };
  
  const updateQuestionType = (questionId: string, type: "multiple" | "single") => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, type } : q))
    );
  };
  
  const updateOptionText = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  };
  
  const updateOptionCorrect = (
    questionId: string,
    optionId: string,
    isCorrect: boolean
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;
        
        // For single-choice questions, unset any previously selected option
        if (q.type === "single" && isCorrect) {
          return {
            ...q,
            options: q.options.map((o) => ({
              ...o,
              isCorrect: o.id === optionId,
            })),
          };
        }
        
        // For multiple-choice, just toggle the selected option
        return {
          ...q,
          options: q.options.map((o) =>
            o.id === optionId ? { ...o, isCorrect } : o
          ),
        };
      })
    );
  };
  
  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;
        
        const newOptionId = `${q.id}-o${q.options.length + 1}`;
        return {
          ...q,
          options: [...q.options, { id: newOptionId, text: "", isCorrect: false }],
        };
      })
    );
  };
  
  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;
        
        // Don't allow removing if only 2 options remain
        if (q.options.length <= 2) {
          toast.error("Each question must have at least two options");
          return q;
        }
        
        return {
          ...q,
          options: q.options.filter((o) => o.id !== optionId),
        };
      })
    );
  };
  
  const handleSave = () => {
    if (!quizTitle.trim()) {
      toast.error("Please provide a quiz title");
      return;
    }
    
    // Validate that all questions have text
    const emptyQuestions = questions.find(q => !q.text.trim());
    if (emptyQuestions) {
      toast.error("All questions must have text");
      return;
    }
    
    // Validate that all questions have at least one correct answer
    const noCorrectAnswer = questions.find(
      q => !q.options.some(o => o.isCorrect)
    );
    if (noCorrectAnswer) {
      toast.error("Each question must have at least one correct answer");
      return;
    }
    
    // Validate that all options have text
    const emptyOptions = questions.find(
      q => q.options.find(o => !o.text.trim())
    );
    if (emptyOptions) {
      toast.error("All options must have text");
      return;
    }
    
    // In a real app, we would save the quiz data to a database here
    toast.success("Quiz created successfully!");
    navigate("/");
  };
  
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2 pl-0 -ml-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-1">Create Quiz</h1>
          <p className="text-muted-foreground">Build a new quiz with custom questions and answers</p>
        </div>
        
        <Button 
          className="gap-1 ml-auto" 
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          Save Quiz
        </Button>
      </div>
      
      <Card className="bg-white">
        <CardHeader>
          <h2 className="text-xl font-semibold">Quiz Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              placeholder="Enter quiz title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quiz-description">Description (optional)</Label>
            <Textarea
              id="quiz-description"
              placeholder="Enter quiz description"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id} className="bg-white">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <h3 className="text-lg font-medium">Question {index + 1}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(question.id)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                <Textarea
                  id={`question-${question.id}`}
                  placeholder="Enter your question"
                  value={question.text}
                  onChange={(e) =>
                    updateQuestionText(question.id, e.target.value)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: "multiple" | "single") =>
                    updateQuestionType(question.id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="single">Single Choice</SelectItem>
                    <SelectItem value="multiple">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Answer Options</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(question.id)}
                    className="text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start space-x-3 border rounded-md p-3"
                  >
                    {question.type === "single" ? (
                      <RadioGroup
                        value={
                          question.options.find((o) => o.isCorrect)?.id || ""
                        }
                        onValueChange={(value) =>
                          updateOptionCorrect(question.id, value, true)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                        </div>
                      </RadioGroup>
                    ) : (
                      <Checkbox
                        id={option.id}
                        checked={option.isCorrect}
                        onCheckedChange={(checked) =>
                          updateOptionCorrect(
                            question.id,
                            option.id,
                            checked as boolean
                          )
                        }
                      />
                    )}
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Enter option text"
                        value={option.text}
                        onChange={(e) =>
                          updateOptionText(question.id, option.id, e.target.value)
                        }
                      />
                      <div className="text-sm text-muted-foreground">
                        {option.isCorrect ? "Correct answer" : "Incorrect answer"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(question.id, option.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button 
          variant="outline" 
          onClick={addQuestion} 
          className="gap-1 w-full"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>
    </div>
  );
};

export default CreateQuiz;
