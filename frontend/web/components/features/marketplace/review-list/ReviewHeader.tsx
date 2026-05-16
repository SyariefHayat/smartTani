'use client';

export function ReviewHeader() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Ulasan Pembeli</h1>
        <p className="text-sm text-muted-foreground">
          Kelola ulasan dan balas masukan dari pelanggan Anda.
        </p>
      </div>
    </div>
  );
}
