import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "success" | "warning";
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
  delay = 0,
}: StatCardProps) {
  const variants = {
    default: {
      card: "bg-card border border-border/50 hover:border-border",
      icon: "icon-container-primary",
      title: "text-muted-foreground",
      value: "text-foreground",
      trend: trend?.isPositive ? "text-success" : "text-destructive",
    },
    primary: {
      card: "card-gradient-primary border-0",
      icon: "bg-white/20 backdrop-blur-sm",
      title: "text-primary-foreground/70",
      value: "text-primary-foreground",
      trend: "text-primary-foreground/90",
    },
    accent: {
      card: "card-gradient-accent border-0",
      icon: "bg-white/20 backdrop-blur-sm",
      title: "text-accent-foreground/70",
      value: "text-accent-foreground",
      trend: "text-accent-foreground/90",
    },
    success: {
      card: "card-gradient-success border-0",
      icon: "bg-white/20 backdrop-blur-sm",
      title: "text-success-foreground/70",
      value: "text-success-foreground",
      trend: "text-success-foreground/90",
    },
    warning: {
      card: "bg-warning border-0",
      icon: "bg-white/20 backdrop-blur-sm",
      title: "text-warning-foreground/70",
      value: "text-warning-foreground",
      trend: "text-warning-foreground/90",
    },
  };

  const styles = variants[variant];

  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-premium transition-all duration-300 hover-lift opacity-0 animate-fade-in-up",
        styles.card,
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className={cn("text-sm font-medium", styles.title)}>
            {title}
          </p>
          <p className={cn("stat-value", styles.value)}>{value}</p>
          {description && (
            <p className={cn("text-sm", styles.title)}>
              {description}
            </p>
          )}
          {trend && (
            <div className={cn("flex items-center gap-1.5 text-sm font-medium", styles.trend)}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="opacity-70 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("icon-container", styles.icon)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
