import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { calculateSubnet } from '@/utils/subnet';

export default function App() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);

  const result = useMemo(() => calculateSubnet(ip, cidr), [ip, cidr]);

  const cls =
    'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  const items = result
    ? [
        { label: 'Network Address', value: result.networkAddress },
        { label: 'Broadcast Address', value: result.broadcastAddress },
        { label: 'Subnet Mask', value: result.subnetMask },
        { label: 'Wildcard Mask', value: result.wildcardMask },
        { label: 'First Host', value: result.firstHost },
        { label: 'Last Host', value: result.lastHost },
        { label: 'Total Hosts', value: result.totalHosts.toLocaleString() },
        { label: 'Usable Hosts', value: result.usableHosts.toLocaleString() },
        { label: 'CIDR', value: `/${result.cidr}` },
        { label: 'IP Class', value: result.ipClass },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">IPv4 Subnet Calculator</h1>
          <p className="text-muted-foreground">IPv4サブネットの計算を行います。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
            <CardDescription>IPアドレスとCIDRを入力してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="space-y-1 flex-1">
                <Label htmlFor="ip">IP Address</Label>
                <input
                  id="ip"
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className={`${cls} w-full`}
                />
              </div>
              <span className="pb-2 text-lg font-mono">/</span>
              <div className="space-y-1 w-20">
                <Label htmlFor="cidr">CIDR</Label>
                <input
                  id="cidr"
                  type="number"
                  min={0}
                  max={32}
                  value={cidr}
                  onChange={(e) => setCidr(Number(e.target.value))}
                  className={`${cls} w-full`}
                />
              </div>
            </div>

            {items.length > 0 && (
              <div className="grid gap-3 pt-4 border-t">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <span className="w-40 text-muted-foreground">{item.label}</span>
                    <code className="font-mono font-medium">{item.value}</code>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
