import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Users, 
  Shield, 
  BookOpen, 
  Target, 
  Award,
  ChevronRight,
  Mail,
  Lock
} from "lucide-react";

type UserRole = "admin" | "teacher" | "student";

interface LoginProps {
  onLogin: (role: UserRole, name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const roles = [
    {
      id: "admin" as UserRole,
      title: "Administrator",
      description: "Manage institute, courses & faculty",
      icon: Shield,
      color: "from-primary to-primary/80",
    },
    {
      id: "teacher" as UserRole,
      title: "Faculty / Teacher",
      description: "Create tests & analyze performance",
      icon: Users,
      color: "from-success to-success/80",
    },
    {
      id: "student" as UserRole,
      title: "Student",
      description: "Attempt tests & track progress",
      icon: GraduationCap,
      color: "from-accent to-accent/80",
    },
  ];

  const features = [
    { icon: BookOpen, text: "JEE Main & Advanced" },
    { icon: Target, text: "NEET Preparation" },
    { icon: Award, text: "AI-Powered Analytics" },
  ];

  const handleLogin = () => {
    if (selectedRole && email) {
      const name = email.split("@")[0];
      onLogin(selectedRole, name);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold">H</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Hiren's</h1>
                <p className="text-xl text-primary-foreground/80">Evaluator Pro</p>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold leading-tight">
                The Complete Exam
                <br />
                <span className="text-gradient">Management Platform</span>
              </h2>
              <p className="text-lg text-primary-foreground/70 max-w-md">
                Trusted by 500+ coaching institutes. Prepare students for JEE, NEET & competitive exams with AI-powered analytics.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20">
              <div>
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm text-primary-foreground/60">Active Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1M+</p>
                <p className="text-sm text-primary-foreground/60">Tests Conducted</p>
              </div>
              <div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-sm text-primary-foreground/60">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-accent-foreground">H</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">Hiren's</h1>
                <p className="text-sm text-muted-foreground">Evaluator Pro</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back!</h2>
            <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Select your role</Label>
            <div className="grid gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedRole === role.id
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-sm`}
                  >
                    <role.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{role.title}</p>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  {selectedRole === role.id && (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center animate-scale-in">
                      <ChevronRight className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          {selectedRole && (
            <div className="space-y-4 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-accent hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
              <Button
                onClick={handleLogin}
                variant="accent"
                size="lg"
                className="w-full"
                disabled={!email}
              >
                Sign In
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <a href="#" className="text-accent hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
