import { LoginSchema } from '@lean-divida/api/schema';
import { useEffect, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../auth';
import { Button } from '@/components/Button';
import Card from '@/components/Card';
import { TextField } from '@/components/TextField';
import { getErrorMessage } from '@/lib/errors';

export function Login() {
  const navigate = useNavigate();
  const login = useLogin();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (login.isError) {
      const errorMessage = getErrorMessage(login.error);
      window.alert(errorMessage);
    }
  }, [login.isError]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const rawInput = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    }
    const validation = LoginSchema.safeParse(rawInput);
    if (!validation.success) {
      window.alert(`> ${validation.error.issues[0]?.message ?? "Check your input."}`);
      return;
    }

    login.mutate(validation.data, {
      onSuccess: () => navigate("/leads", { replace: true }),
    });
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="h-screen flex flex-col justify-center items-center p-6">
      <Card className="p-0 w-full md:w-md">
        <div className="flex flex-col justify-center items-center border-b border-stone-200 px-6 py-4">
          <h1 className="text-xl font-semibold">Divida - Log In</h1>
        </div>
        <div className="flex flex-col items-stretch py-4 gap-4 px-6">
          <TextField ref={emailRef} name="email" placeholder="Enter email" type="email" required />
          <TextField ref={passwordRef} name="password" placeholder="Enter password" type="password" required />
        </div>
        <div className="flex flex-col items-stretch border-t border-stone-200 py-4 px-6">
          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? "Logging In..." : "Log In"}
          </Button>
        </div>
      </Card>
    </form>
  )
}
