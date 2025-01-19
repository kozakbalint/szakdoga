import { ContentLayout } from '@/components/layouts';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';

export const Route = createFileRoute('/app/settings')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: SettingsRoute,
});

function SettingsRoute() {
  const [selectedProvider, setSelectedProvider] = useLocalStorage(
    'preferredProvider',
    'Stream',
  );

  return (
    <ContentLayout title="Settings" head="Settings">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <div>Preferred watch provider method:</div>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-[180px]">
              <div>{selectedProvider}</div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Stream">Stream</SelectItem>
              <SelectItem value="Buy">Buy</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </ContentLayout>
  );
}
