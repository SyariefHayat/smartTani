'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { cartService } from '@/services/cart';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  MapPin,
  Building2,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  User,
  Phone,
} from 'lucide-react';

const MOCK_CART = {
  items: [
    {
      id: 'cart-1',
      product_id: 'prod-001',
      title: 'Beras Pandan Wangi Organik',
      price: 18000,
      quantity: 500, // bulk qty
      unit: 'kg',
      image: 'https://placehold.co/600x400?text=Beras+Pandan+Wangi',
    },
    {
      id: 'cart-2',
      product_id: 'prod-002',
      title: 'Wortel Brastagi Segar',
      price: 8000,
      quantity: 100,
      unit: 'kg',
      image: 'https://placehold.co/600x400?text=Wortel+Brastagi',
    },
  ],
};

export default function DistributorCheckoutPage() {
  const router = useRouter();
  const [isOffline, setIsOffline] = React.useState(false);
  const [shippingAddress, setShippingAddress] = React.useState({
    full_name: 'Distributor Sembako Mandiri',
    phone: '0812-3456-7890',
    address: 'Gudang Utama Blok C, Jl. Raya Industri No. 45',
    city: 'Surabaya',
    province: 'Jawa Timur',
    postal_code: '60112',
  });
  const [paymentMethod, setPaymentMethod] = React.useState('midtrans');

  // Fetch cart
  const { data: cart, isLoading } = useQuery({
    queryKey: ['distributor-cart'],
    queryFn: async () => {
      try {
        const res = await cartService.getCart();
        if (!res || !res.data || !res.data.items || res.data.items.length === 0)
          throw new Error('Empty');
        return res.data;
      } catch {
        setIsOffline(true);
        return MOCK_CART;
      }
    },
  });

  const activeCart = (cart || MOCK_CART) as typeof MOCK_CART;

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      try {
        const payload = {
          shippingAddress: {
            recipient_name: shippingAddress.full_name,
            phone_number: shippingAddress.phone,
            full_address: shippingAddress.address,
            city: shippingAddress.city,
            province: shippingAddress.province,
            postal_code: shippingAddress.postal_code,
          },
        };
        const orderRes = await orderService.checkout(payload);
        toast.success('Pesanan grosir B2B berhasil dibuat!', {
          description: 'Mengarahkan ke pembayaran...',
        });
        router.push(`/dashboard/distributor/orders/${orderRes.data.id}`);
      } catch {
        // Local simulation fallback
        toast.success('[Simulasi] Pesanan grosir B2B berhasil dibuat!', {
          description: 'Membuka rincian detail pelacakan pesanan.',
        });
        router.push('/dashboard/distributor/orders/ORD-98822');
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const subtotal = activeCart.items.reduce(
    (sum: number, item: (typeof MOCK_CART.items)[number]) => sum + item.price * item.quantity,
    0
  );
  const platformFee = 10000;
  const shippingCost = 170000;
  const grandTotal = subtotal + platformFee + shippingCost;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/distributor/catalog"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali Belanja
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Checkout Pengadaan Grosir
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Tinjau keranjang grosir B2B Anda dan verifikasi alamat gudang pengiriman utama.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Pembuatan pesanan grosir dan inisiasi pembayaran disimulasikan menggunakan memori
              offline lokal.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Checkout Details */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Address form & Items summary */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Warehouse destination address */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center gap-2 space-y-0">
              <Building2 className="h-4.5 w-4.5 text-green-600" />
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Alamat Gudang Utama Distributor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Full name / Warehouse owner */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Nama Penerima / Gudang
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      value={shippingAddress.full_name}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, full_name: e.target.value })
                      }
                      className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500 w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Nomor HP Penerima
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                      className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Alamat Gudang (Lengkap)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address: e.target.value })
                    }
                    rows={2}
                    className="pl-10 pt-2.5 text-xs font-semibold border border-slate-200 rounded-lg focus:border-green-500 w-full"
                  />
                </div>
              </div>

              {/* City / Province / Postal Code */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Kabupaten/Kota
                  </label>
                  <Input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    className="h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Provinsi
                  </label>
                  <Input
                    type="text"
                    value={shippingAddress.province}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, province: e.target.value })
                    }
                    className="h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Kode Pos
                  </label>
                  <Input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, postal_code: e.target.value })
                    }
                    className="h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Items Preview Table */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Rincian Barang Grosir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-3 pl-4">
                        Produk
                      </th>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Harga
                      </th>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Jumlah
                      </th>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCart.items.map((item: (typeof MOCK_CART.items)[number]) => (
                      <tr key={item.id} className="hover:bg-slate-50/10">
                        <td className="py-3 pl-4 flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200/60">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              Satuan: per {item.unit}
                            </p>
                          </div>
                        </td>
                        <td className="text-xs font-semibold text-slate-600 text-right">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="text-xs font-bold text-slate-800 text-center">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="text-xs font-bold text-slate-800 text-right pr-4">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Billing calculations & payment initiator */}
        <div className="space-y-6">
          {/* Card 3: Pricing Summary */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ringkasan Tagihan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal Pembelian</span>
                <span className="text-slate-800 font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Logistik Rantai Pasok</span>
                <span className="text-slate-800 font-bold">{formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Platform B2B</span>
                <span className="text-slate-800 font-bold">{formatCurrency(platformFee)}</span>
              </div>

              {/* Payment selector */}
              <div className="space-y-1.5 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Metode Pembayaran
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-11 border-slate-200 text-xs font-semibold focus:border-green-500 w-full cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <SelectValue placeholder="Pilih Metode" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midtrans" className="text-xs cursor-pointer">
                      Gateway Midtrans (E-Wallet / VA)
                    </SelectItem>
                    <SelectItem value="cod" className="text-xs cursor-pointer">
                      Bayar di Tempat (COD Grosir)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between pt-4 border-t border-slate-200/85 text-slate-800 font-bold">
                <span className="text-sm">Total Tagihan Grosir</span>
                <span className="text-green-600 text-base">{formatCurrency(grandTotal)}</span>
              </div>

              {/* Platform trust note */}
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-semibold bg-green-50/50 p-2.5 rounded-lg border border-green-100/50 mt-4">
                <ShieldCheck className="h-4.5 w-4.5 text-green-600 shrink-0" />
                <span>
                  Pembayaran Anda aman. Jaminan uang kembali jika terjadi keterlambatan logistik
                  ekstrim.
                </span>
              </div>
            </CardContent>

            {/* Submit Action */}
            <CardFooter className="pt-2 pb-6 border-t border-slate-50">
              <Button
                onClick={() => checkoutMutation.mutate()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-11 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                disabled={checkoutMutation.isPending}
              >
                Buat Pesanan Grosir
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
