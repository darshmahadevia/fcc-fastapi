import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

// Motion-enhanced textarea with focus animation
const MotionTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<HTMLMotionProps<"textarea">, "ref"> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <motion.textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      whileFocus={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      {...props}
    />
  )
})
MotionTextarea.displayName = "MotionTextarea"

export { Textarea, MotionTextarea }
