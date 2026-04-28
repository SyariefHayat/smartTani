"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LOGIN_FORM } from "@/constants/login";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            {LOGIN_FORM.title}
          </CardTitle>
          <CardDescription>
            {LOGIN_FORM.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-sm font-bold text-gray-700 mb-2 block">
                  {LOGIN_FORM.emailLabel}
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={LOGIN_FORM.emailPlaceholder}
                  required
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-primary transition-all text-sm px-5"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between mb-2">
                  <FieldLabel htmlFor="password" className="text-sm font-bold text-gray-700">
                    {LOGIN_FORM.passwordLabel}
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                  >
                    {LOGIN_FORM.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={LOGIN_FORM.passwordPlaceholder}
                  required
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-primary transition-all text-sm px-5"
                />
              </Field>
            </FieldGroup>

            <div className="mt-8 space-">
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-sm"
              >
                {LOGIN_FORM.submitButton}
              </Button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {LOGIN_FORM.dividerText}
                </span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full h-12 border-slate-200 hover:bg-slate-50 text-gray-700 font-bold rounded-xl transition-all text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                {LOGIN_FORM.googleButton}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-7 border-t border-slate-200 text-center space-y-3">
            <p className="text-sm font-medium text-slate-500">
              {LOGIN_FORM.registerPrompt}{" "}
              <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4">
                {LOGIN_FORM.registerLink}
              </Link>
            </p>

            <p className="text-[11px] leading-relaxed text-slate-400 max-w-[300px] mx-auto font-medium">
              {LOGIN_FORM.termsAgreement}{" "}
              <Link href="/terms" className="hover:text-primary transition-colors underline decoration-slate-200 underline-offset-2">
                {LOGIN_FORM.termsLink}
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="hover:text-primary transition-colors underline decoration-slate-200 underline-offset-2">
                {LOGIN_FORM.privacyLink}
              </Link>{" "}
              {LOGIN_FORM.footerText}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
