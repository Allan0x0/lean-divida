import { LoginSchema } from '@lean-divida/api/schema';
import { useEffect, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../auth';
import { Button } from '@/components/Button';
import Card from '@/components/Card';
import { TextField } from '@/components/TextField';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (login.isError) {
      window.alert(login.error.message);
    }
  }, [login.isError]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const rawInput = {
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
    }
    const validation = LoginSchema.safeParse(rawInput);
    if (!validation.success) {
      window.alert(validation.error.message);
      return;
    }
    
    login.mutate(validation.data, {
      onSuccess: () => navigate("/leads", { replace: true }),
    });
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="h-screen flex flex-col justify-center items-center p-6">
      <Card className="p-0 w-full md:w-3/5 lg:w-2/5">
        <div className="flex flex-col justify-center items-center border-b border-stone-200 px-6 py-4">
          <h1 className="text-xl font-semibold">Divida - Log In</h1>
        </div>
        <div className="flex flex-col items-stretch py-4 gap-4 px-6">
          <TextField ref={usernameRef} name="username" placeholder="Enter username" type="text" required />
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
