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
  Lock,
  Sparkles,
  CheckCircle2,
  User,
  Phone,
  Building2,
} from "lucide-react";

type UserRole = "admin" | "teacher" | "student";

interface SignUpProps {
  onSignUp?: (role: UserRole, name: string, email: string) => void;
}

export default function SignUp({ onSignUp }: SignUpProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    institute: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const roles = [
    {
      id: "admin" as UserRole,
      title: "Administrator",
      description: "Manage institute, courses & faculty",
      icon: Shield,
      gradient: "from-primary to-primary/70",
    },
    {
      id: "teacher" as UserRole,
      title: "Faculty / Teacher",
      description: "Create tests & analyze performance",
      icon: Users,
      gradient: "from-success to-success/70",
    },
    {
      id: "student" as UserRole,
      title: "Student",
      description: "Attempt tests & track progress",
      icon: GraduationCap,
      gradient: "from-accent to-orange-400",
    },
  ];

  const features = [
    { icon: BookOpen, text: "JEE Main & Advanced", delay: 0 },
    { icon: Target, text: "NEET Preparation", delay: 100 },
    { icon: Award, text: "AI-Powered Analytics", delay: 200 },
  ];

  const stats = [
    { value: "50K+", label: "Active Students" },
    { value: "1M+", label: "Tests Conducted" },
    { value: "98%", label: "Success Rate" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (selectedRole === "admin" && !formData.institute.trim()) {
      newErrors.institute = "Institute name is required for administrators";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!selectedRole) {
      return;
    }

    if (validateForm()) {
      // Call the onSignUp callback if provided
      if (onSignUp) {
        onSignUp(selectedRole, formData.fullName, formData.email);
      }
      // Navigate to login page or dashboard
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-[55%] gradient-hero hero-pattern relative overflow-hidden">
        {/* Floating Decorations */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="absolute bottom-32 left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-success/10 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 pattern-dots opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center p-16 text-primary-foreground">
          <div className="max-w-xl space-y-10">
            {/* Logo */}
            <div className="flex items-center gap-4 animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <span className="text-3xl font-bold">H</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Hiren's</h1>
                <p className="text-xl text-primary-foreground/70 font-medium">Evaluator Pro</p>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-4 animate-fade-in-up stagger-1">
              <h2 className="text-4xl font-bold leading-tight tracking-tight">
                Join The Complete Exam
                <br />
                <span className="text-gradient">Management Platform</span>
              </h2>
              <p className="text-lg text-primary-foreground/60 max-w-md leading-relaxed">
                Trusted by 500+ coaching institutes. Prepare students for JEE, NEET & competitive exams with AI-powered analytics.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 opacity-0 animate-slide-in-right"
                  style={{ animationDelay: `${300 + feature.delay}ms`, animationFillMode: "forwards" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                  <CheckCircle2 className="h-5 w-5 text-success ml-auto" />
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        
        <div className="w-full max-w-md space-y-6 relative z-10 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <span className="text-2xl font-bold text-accent-foreground">H</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">Hiren's</h1>
                <p className="text-sm text-muted-foreground font-medium">Evaluator Pro</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-2">
              <Sparkles className="h-4 w-4" />
              Start your learning journey today
            </div>
            <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground">Join thousands of students and educators</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Label className="text-sm font-semibold text-foreground">Select your role</Label>
            <div className="grid gap-2">
              {roles.map((role, index) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 text-left opacity-0 animate-fade-in-up ${
                    selectedRole === role.id
                      ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                      : "border-border/50 hover:border-accent/30 hover:bg-muted/50"
                  }`}
                  style={{ animationDelay: `${150 + index * 50}ms`, animationFillMode: "forwards" }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}
                  >
                    <role.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{role.title}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  <div 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedRole === role.id 
                        ? "bg-accent border-accent" 
                        : "border-border group-hover:border-accent/50"
                    }`}
                  >
                    {selectedRole === role.id && (
                      <CheckCircle2 className="h-3 w-3 text-accent-foreground animate-scale-in" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Form */}
          {selectedRole && (
            <div className="space-y-4 animate-fade-in-up max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-foreground font-medium text-sm">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`pl-10 h-12 rounded-xl border-2 bg-card/50 text-sm transition-all ${
                      errors.fullName ? "border-destructive" : "border-border/50 focus:border-accent"
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground font-medium text-sm">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 h-12 rounded-xl border-2 bg-card/50 text-sm transition-all ${
                      errors.email ? "border-destructive" : "border-border/50 focus:border-accent"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              {(selectedRole === "student" || selectedRole === "teacher") && (
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-foreground font-medium text-sm">Phone Number (Optional)</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 h-12 rounded-xl border-2 border-border/50 focus:border-accent bg-card/50 text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "admin" && (
                <div className="space-y-1.5">
                  <Label htmlFor="institute" className="text-foreground font-medium text-sm">Institute Name</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
                    <Input
                      id="institute"
                      type="text"
                      placeholder="Enter your institute name"
                      value={formData.institute}
                      onChange={(e) => handleInputChange("institute", e.target.value)}
                      className={`pl-10 h-12 rounded-xl border-2 bg-card/50 text-sm transition-all ${
                        errors.institute ? "border-destructive" : "border-border/50 focus:border-accent"
                      }`}
                    />
                    {errors.institute && <p className="text-xs text-destructive mt-1">{errors.institute}</p>}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground font-medium text-sm">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 h-12 rounded-xl border-2 bg-card/50 text-sm transition-all ${
                      errors.password ? "border-destructive" : "border-border/50 focus:border-accent"
                    }`}
                  />
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 h-12 rounded-xl border-2 bg-card/50 text-sm transition-all ${
                      errors.confirmPassword ? "border-destructive" : "border-border/50 focus:border-accent"
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 w-4 h-4 rounded border-2 border-border text-accent focus:ring-accent"
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="text-accent hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                </label>
              </div>

              <Button
                onClick={handleSignUp}
                variant="accent"
                size="lg"
                className="w-full rounded-xl shadow-glow-accent hover:shadow-glow-accent/80 transition-all"
              >
                Create Account
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-accent hover:text-accent/80 font-semibold transition-colors hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
