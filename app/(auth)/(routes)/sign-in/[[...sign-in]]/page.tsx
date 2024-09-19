import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <AuthLayout>
      <SignIn path='/sign-in'/>

    </AuthLayout>
  )
}