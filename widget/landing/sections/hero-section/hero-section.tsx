'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/config/routes';
import { Button } from '@/shared/components/ui/button';
import SplashCursor from './animations/splash-cursor';

export type AvatarList = {
  image: string;
};

type HeroSectionProps = {
  avatarList: AvatarList[];
};

function HeroSection({ avatarList }: HeroSectionProps) {
  const t = useTranslations('landing.hero');

  return (
    <section>
      <div className='relative h-full w-full'>
        <div className='pointer-events-none absolute inset-0 -z-1'>
          <SplashCursor
            SIM_RESOLUTION={128}
            DYE_RESOLUTION={1440}
            DENSITY_DISSIPATION={3.5}
            VELOCITY_DISSIPATION={2}
            PRESSURE={0.1}
            CURL={3}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            COLOR_UPDATE_SPEED={10}
          />
        </div>
        <div className='relative w-full pt-0 pb-6 before:absolute before:top-24 before:-z-10 before:h-full before:w-full before:rounded-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:blur-3xl dark:before:rounded-full dark:before:bg-linear-to-r dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:blur-3xl md:pt-20 md:pb-10'>
          <div className='container relative z-10 mx-auto'>
            <div className='mx-auto flex max-w-5xl flex-col gap-8'>
              <div className='relative flex flex-col items-center gap-4 text-center sm:gap-6'>
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className='text-5xl font-medium leading-14 md:text-7xl md:leading-20 lg:text-8xl lg:leading-24'
                >
                  {t('titlePrefix')} <span>{t('titleHighlight')}</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
                  className='max-w-2xl text-base font-normal text-muted-foreground'
                >
                  {t('description')}
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
                className='flex flex-col items-center justify-center gap-8 md:flex-row'
              >
                <Button
                  asChild
                  className='group relative h-12 w-fit overflow-hidden rounded-full p-1 pe-14 ps-6 text-sm font-medium transition-all duration-500 hover:pe-6 hover:ps-14'
                >
                  <Link href={ROUTES.COMPANY}>
                    <span className='relative z-10 transition-all duration-500'>{t('cta')}</span>
                    <div className='absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45'>
                      <ArrowUpRight size={16} />
                    </div>
                  </Link>
                </Button>
                <div className='flex items-center gap-3 sm:gap-7'>
                  <ul className='avatar flex flex-row items-center'>
                    {avatarList.map((avatar, index) => (
                      <li
                        key={index}
                        className='-mr-2 z-1 avatar-hover:ml-2'
                      >
                        <img
                          src={avatar.image}
                          alt='Avatar'
                          width={40}
                          height={40}
                          className='rounded-full border-2 border-white'
                        />
                      </li>
                    ))}
                  </ul>
                  <div className='flex flex-col items-start gap-1'>
                    <div className='flex gap-1'>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <img
                          key={index}
                          src='https://images.shadcnspace.com/assets/svgs/icon-star.svg'
                          alt='star'
                          className='h-4 w-4'
                        />
                      ))}
                    </div>
                    <p className='text-xs font-normal text-muted-foreground sm:text-sm'>{t('socialProof')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
