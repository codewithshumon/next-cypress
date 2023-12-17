'use client';

import { z } from 'zod';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';

const SignUpFormSchema = z
  .object({
    email: z.string().describe('Email').email('Invalid Email'),
    password: z
      .string()
      .describe('Password')
      .min(6, 'Password must be minimum 6 characters'),
    confirmPassword: z
      .string()
      .describe('Confirm Password')
      .min(6, 'Password must be minimum 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(false);

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return '';

    searchParams.get('error_description');
  }, [searchParams]);

  const confirmationAndErrorStyle = useMemo(
    () =>
      clsx('bg-primary', {
        'bg-red-500/10': codeExchangeError,
        'text-red-700': codeExchangeError,
        'border-red-500/50': codeExchangeError,
      }),
    [codeExchangeError]
  );

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = () => {};
  const signUpHandler = () => {};
  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError('');
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:justify-center sm:w-[400px]
        space-y-6 flex
        flex-col
        "
      >
        <Link href="/" className="w-full flex justify-left items-center">
          <Image
            alt="Cypress Logo"
            src={'/cypresslogo.svg'}
            width={50}
            height={50}
          />
          <span className="font-semibold dark:text-white text-4xl first-letter:ml-2">
            nextCypress
          </span>
        </Link>
        <FormDescription className="text-foreground/60">
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>
        {!confirmation && !codeExchangeError && (
          <>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={(field) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="password"
              render={(field) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="confirmPassword"
              render={(field) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full p-6">
              {!isLoading ? 'Create Account' : <Loader />}
            </Button>
          </>
        )}

        {submitError && <FormMessage>{submitError}</FormMessage>}
        <span className="self-container">
          Already have account?{' '}
          <Link href="login" className="text-primary">
            Login
          </Link>
        </span>
        {confirmation && codeExchangeError && (
          <>
            <Alert className={confirmationAndErrorStyle}>
              {!codeExchangeError && <MailCheck className=" w-4 h-4" />}
              <AlertTitle>
                {codeExchangeError ? 'Invalid Link' : 'Check your email'}
              </AlertTitle>
              <AlertDescription>
                {codeExchangeError || 'An email confirmation has been sent.'}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  );
};

export default Signup;
