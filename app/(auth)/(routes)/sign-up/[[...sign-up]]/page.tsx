import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <AuthLayout>
      <SignUp path='/sign-up' />
    </AuthLayout>
  )
}