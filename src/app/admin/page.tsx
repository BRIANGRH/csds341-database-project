import { TradePlayerForm } from '@/components/admin/TradePlayerForm';
import { AddPlayerForm } from '@/components/admin/AddPlayerForm';
import { SignPlayerForm } from '@/components/admin/SignPlayerForm';
import { WaivePlayerForm } from '@/components/admin/WaivePlayerForm';
import { RemovePlayerForm } from '@/components/admin/RemovePlayerForm';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-8">Admin</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AddPlayerForm />
        <TradePlayerForm />
        <SignPlayerForm />
        <WaivePlayerForm />
        <RemovePlayerForm />
      </div>
    </div>
  );
}
