
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Brain,
  Clock,
  FileQuestion,
  MoreHorizontal, 
  Plus,
  Search 
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Sample quiz data
const sampleQuizzes = [
  {
    id: "1",
    title: "Basic Mathematics",
    questions: 10,
    lastUpdated: "2025-04-12",
    category: "Math"
  },
  {
    id: "2",
    title: "World Geography",
    questions: 15,
    lastUpdated: "2025-04-14",
    category: "Geography"
  },
  {
    id: "3",
    title: "Science: Elements",
    questions: 8,
    lastUpdated: "2025-04-15",
    category: "Science"
  }
];

const Dashboard = () => {
  const [quizzes] = useState(sampleQuizzes);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Quizzes</h1>
          <p className="text-muted-foreground">Manage and create your quiz tests</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <Link to="/create">
          <Card className="h-[220px] flex flex-col items-center justify-center border-dashed border-2 hover:border-quiz-primary quiz-card bg-white">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
              <div className="h-12 w-12 rounded-full bg-quiz-light flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-quiz-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Create New Quiz</h3>
              <p className="text-muted-foreground text-sm text-center">
                Start building a new quiz test
              </p>
            </CardContent>
          </Card>
        </Link>
        
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="quiz-card bg-white">
            <CardHeader className="pb-3 pt-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-quiz-light flex items-center justify-center">
                    <Brain className="h-4 w-4 text-quiz-primary" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {quiz.category}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="text-lg font-semibold mt-3">{quiz.title}</h3>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileQuestion className="h-4 w-4" />
                <span>{quiz.questions} questions</span>
              </div>
            </CardContent>
            <CardFooter className="pt-1 pb-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Updated {new Date(quiz.lastUpdated).toLocaleDateString()}</span>
              </div>
              
              <Link to={`/preview/${quiz.id}`}>
                <Button size="sm" variant="outline">Preview</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredQuizzes.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No quizzes found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
