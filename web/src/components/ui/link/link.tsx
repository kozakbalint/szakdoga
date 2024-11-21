import { cn } from '@/utils/cn';

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn('text-primary hover:text-muted-foreground', className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
