import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function TestDesignPage() {
  return (
    <div className="container-smarttani section-padding space-y-12">
      <header>
        <h1 className="text-display text-primary">Design System Test — Smarttani Indonesia</h1>
        <p className="text-body-lg text-muted-foreground mt-2">Verifikasi visual token warna, font, dan komponen.</p>
      </header>

      <Separator />

      {/* Typography Section */}
      <section className="space-y-6">
        <h2 className="text-heading-1 underline decoration-primary/30">1. Typography Scale</h2>
        <div className="space-y-4">
          <p className="text-display">text-display: Plus Jakarta Sans 6xl</p>
          <p className="text-heading-1">text-heading-1: Plus Jakarta Sans 4xl</p>
          <p className="text-heading-2">text-heading-2: Plus Jakarta Sans 3xl</p>
          <p className="text-heading-3">text-heading-3: Plus Jakarta Sans 2xl</p>
          <p className="text-body-lg">text-body-lg: Font badan paragraf besar (18px/20px)</p>
          <p className="text-body">text-body: Font badan paragraf standar (16px)</p>
          <p className="text-body-sm">text-body-sm: Font badan paragraf kecil (14px)</p>
          <p className="text-caption">text-caption: Teks keterangan/label sangat kecil (12px)</p>
        </div>
      </section>

      <Separator />

      {/* Colors Section */}
      <section className="space-y-6">
        <h2 className="text-heading-1 underline decoration-primary/30">2. Color Token Swatches</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="h-20 w-full bg-primary rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-primary (#1A6B2F)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-primary-dark rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-primary-dark (#14521F)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-primary-medium rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-primary-medium (#2D8A47)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-primary-light rounded-md shadow-sm border border-border"></div>
            <p className="text-caption font-bold">bg-primary-light (#E8F5EC)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-accent rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-accent (#F5A623)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-accent-dark rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-accent-dark (#D4891A)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-success rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-success (#22C55E)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-warning rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-warning (#EAB308)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-info rounded-md shadow-sm"></div>
            <p className="text-caption font-bold">bg-info (#3B82F6)</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-heading-1 underline decoration-primary/30">3. Buttons & Badges</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default">Button Default (Hijau)</Button>
          <Button variant="accent">Button Accent (Kuning)</Button>
          <Button variant="outline">Button Outline</Button>
          <Button variant="secondary">Button Secondary</Button>
          <Button variant="ghost">Button Ghost</Button>
          <Button variant="destructive">Button Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Badge Default</Badge>
          <Badge variant="secondary">Badge Secondary</Badge>
          <Badge variant="outline">Badge Outline</Badge>
          <Badge variant="destructive">Badge Destructive</Badge>
          <Badge className="bg-success hover:bg-success/80">Badge Success</Badge>
          <Badge className="bg-warning hover:bg-warning/80">Badge Warning</Badge>
          <Badge className="bg-info hover:bg-info/80">Badge Info</Badge>
        </div>
      </section>

      <Separator />

      {/* Gradients & Glassmorphism */}
      <section className="space-y-6">
        <h2 className="text-heading-1 underline decoration-primary/30">4. Special Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 rounded-xl bg-smarttani-gradient flex items-center justify-center text-white font-bold shadow-hero">
            bg-smarttani-gradient
          </div>
          <div className="h-40 rounded-xl bg-cta-gradient flex items-center justify-center text-white font-bold">
            bg-cta-gradient
          </div>
          <div className="h-40 rounded-xl bg-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center opacity-40"></div>
            <div className="glass-card p-6 rounded-lg text-primary font-bold z-10">
              glass-card effect
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Components Section */}
      <section className="space-y-6">
        <h2 className="text-heading-1 underline decoration-primary/30">5. Shadcn Components Demo</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Contoh Card</CardTitle>
              <CardDescription>Menampilkan box shadow shadow-card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="contoh@smarttani.id" />
              </div>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body font-semibold">User Smarttani</p>
                  <p className="text-caption text-muted-foreground">Petani Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Card dengan Hover</CardTitle>
              <CardDescription>Hover untuk melihat shadow-card-hover.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body italic text-muted-foreground">
                &quot;Platform ini sangat membantu saya dalam memantau harga pasar secara real-time.&quot;
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
