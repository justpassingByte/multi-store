
import { AuthLayout } from '@/app/(auth)/layout'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    
      <SignUp path='/sign-up' />
  
  )
}