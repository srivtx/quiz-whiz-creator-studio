
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BrainCircuit, Menu, PlusCircle } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b bg-white sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
          
          <Link to="/" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-quiz-primary" />
            <span className="font-bold text-lg hidden md:inline-block">Quiz Whiz</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/create">
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline-block">Create Quiz</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
