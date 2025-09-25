import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// Agricultural button variants
const agriculturalButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-medium hover:bg-primary-dark hover:shadow-strong active:scale-95",
        success: "bg-success text-success-foreground shadow-medium hover:opacity-90 hover:shadow-strong active:scale-95",
        warning: "bg-warning text-warning-foreground shadow-medium hover:opacity-90 hover:shadow-strong active:scale-95",
        upload: "gradient-primary text-white shadow-strong hover:shadow-strong hover:scale-105 active:scale-95 border-2 border-white/20",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-colors",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface AgriculturalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof agriculturalButtonVariants> {}

const AgriculturalButton = forwardRef<HTMLButtonElement, AgriculturalButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(agriculturalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

AgriculturalButton.displayName = "AgriculturalButton";

export { AgriculturalButton, agriculturalButtonVariants };