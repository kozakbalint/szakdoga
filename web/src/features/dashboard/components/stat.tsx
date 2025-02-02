import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Stat = ({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value?: number;
}) => {
  return (
    <Card className="w-[200px]">
      <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2 gap-2">
        {icon}
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="text-2xl font-bold">{value ?? '-'}</div>
      </CardContent>
    </Card>
  );
};
