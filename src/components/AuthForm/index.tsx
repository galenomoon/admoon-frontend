import React, { useState } from 'react'

//styles
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { Spinner } from '@phosphor-icons/react'

//components
import Button from '@/components/Button'

interface AuthFormProps {
  user: { email: string, password: string }
  setUser: React.Dispatch<React.SetStateAction<{ email: string, password: string }>>
  handleAuth: (e: React.FormEvent) => Promise<void>
  isLoaded: boolean
}

export default function AuthForm({ user, setUser, handleAuth, isLoaded }: AuthFormProps) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)

  return (
    <form onSubmit={handleAuth} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-3'>
        <section className='flex flex-col gap-1'>
          <label className='text-sm font-satoshi-regular'>Email</label>
          <input
            required
            value={user.email}
            type='email'
            onChange={e => setUser({ ...user, email: e.target.value })}
            placeholder="Digite seu email"
            className='border border-gray-300 rounded-lg px-4 py-2 outline-none'
          />
        </section>
        <section className='flex flex-col gap-1'>
          <label className='text-sm font-satoshi-regular'>Senha</label>
          <div className='flex w-full relative'>
            <input
              required
              value={user.password}
              placeholder='********'
              onChange={e => setUser({ ...user, password: e.target.value })}
              type={isPasswordHidden ? 'password' : 'text'}
              className='border border-gray-300 rounded-lg px-4 py-2 outline-none w-full'
            />
            <button
              type='button'
              onClick={() => setIsPasswordHidden(!isPasswordHidden)}
              className='absolute self-center right-3 opacity-80'
            >
              {isPasswordHidden ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
        </section>
      </div>
      <Button
        type='submit'
        disabled={user.email === '' || user.password === '' || !isLoaded}
      >
        {isLoaded ? 'Entrar' : <Spinner size={26} className='animate-spin' />}
      </Button>
    </form>
  )
}
