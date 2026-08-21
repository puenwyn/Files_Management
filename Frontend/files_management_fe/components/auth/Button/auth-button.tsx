import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthButtonProps
    extends React.ComponentProps<typeof Button> {}

export default function AuthButton({
    className,
    ...props
}: AuthButtonProps) {
    return (
        <Button
            {...props}
            className={cn(
                "h-11 w-full rounded-lg",
                className
            )}
        />
    );
}