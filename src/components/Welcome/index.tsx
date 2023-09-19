import React from 'react'

//components
import EmptyState from '../EmptyState'

//assets
import welcome from '@/assets/welcome.svg'

export default function Welcome() {
  return (
    <section className='sm:h-[80dvh] md:w-full h-full flex flex-col justify-center items-center'>
      <EmptyState
        imageSrc={welcome}
        imageStyle={{
          width: 564,
          figureClassName: 'sm:h-[300px] md:h-[422px]',
          imageClassName: 'sm:h-[200px] md:h-[370px]'

        }}
        title='Bem-vindo(a) ao painel de administração da Hi, Moon Store!'
        description={'Aqui, você encontrará todas as ferramentas para gerenciar atividades e processos com eficiência.\nExplore as funcionalidades e recursos disponíveis para uma experiência completa.'}
      />
    </section>
  )
}
