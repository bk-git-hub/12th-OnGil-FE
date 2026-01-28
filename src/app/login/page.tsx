import LoginForm from '@/components/login/login-form';
import { Suspense } from 'react';
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
