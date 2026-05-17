import { Metadata } from 'next';
import { REGISTER_META } from '@/constants/register';
import Hero from '@/components/sections/register/Hero';
import Form from '@/components/sections/register/Form';

export const metadata: Metadata = {
  title: REGISTER_META.title,
  description: REGISTER_META.description,
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Form />
    </main>
  );
}
