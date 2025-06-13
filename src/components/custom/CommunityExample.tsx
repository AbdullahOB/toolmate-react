'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Users, Star, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function CommunityExample() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const communityState = [
    {
      name: 'Weekend Warriors',
      members: 1250,
      tag: 'most active',
      description:
        'Connect with passionate DIYers, share your latest projects, and get expert advice on home improvement challenges.',
      cta: 'Join Now',
      icon: '/assets/icons/communityNavIcon.svg',
      mateyImage: '/assets/matey/thumbsUp.svg',
      color: 'from-yellow-100 to-yellow-300',
    },
    {
      name: 'First-Time Renovators',
      members: 875,
      tag: 'popular',
      description:
        'The ultimate community for tool enthusiasts. Discuss the latest gear, share tips, and learn from seasoned professionals.',
      cta: 'Learn More',
      icon: '/assets/icons/hammer.svg',
      mateyImage: '/assets/matey/tools.svg',
      color: 'from-orange-100 to-orange-300',
    },
    {
      name: 'Tool Hoarders',
      members: 620,
      tag: 'new group',
      description:
        'From foundation to roof, join fellow builders to discuss techniques, materials, and best practices for construction projects.',
      cta: 'Get Started',
      icon: '/assets/icons/userCommunityNavIcon.svg',
      mateyImage: '/assets/matey/presenting.svg',
      color: 'from-yellow-100 to-yellow-300',
    },
  ];

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'most active':
        return <Users className='w-4 h-4 mr-1' />;
      case 'popular':
        return <Star className='w-4 h-4 mr-1' />;
      case 'new group':
        return <Clock className='w-4 h-4 mr-1' />;
      default:
        return <Award className='w-4 h-4 mr-1' />;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'most active':
        return 'bg-yellow text-black';
      case 'popular':
        return 'bg-orange-500 text-white';
      case 'new group':
        return 'bg-green-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <section className='w-full mt-5 md:mt-10 relative overflow-hidden py-10' ref={containerRef}>  
      <Carousel
        opts={{
          align: 'start',
        }}
        onSelect={(e) => {
          const selectedIndex = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0', 10);
          setActiveIndex(selectedIndex);
        }}
        className='w-full relative z-10'>
        <CarouselContent className='flex w-full cursor-grab active:cursor-grabbing py-4'>
          {communityState.map((community, index) => (
            <CarouselItem key={index} className='md:basis-1/2 w-full lg:basis-1/3 pl-4 md:pl-6'>
              <motion.div
                className={`rounded-2xl flex flex-col justify-between overflow-hidden shadow-lg h-full
                  border-2 border-yellow-400 relative`}
                whileHover={{
                  y: -10,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                onHoverStart={() => setIsHovered(index)}
                onHoverEnd={() => setIsHovered(null)}>
                <div className={`absolute inset-0 bg-gradient-to-br ${community.color} opacity-30`}></div>
                <motion.div
                  className='absolute -right-20 bottom-0 w-32 h-32 opacity-0'
                  animate={{
                    opacity: isHovered === index ? 0.9 : 0,
                    x: isHovered === index ? -30 : 0,
                  }}
                  transition={{ duration: 0.3 }}>
                  <img src={community.mateyImage || '/placeholder.svg'} alt='Matey' className='w-full h-full' />
                </motion.div>

                {/* Top section */}
                <div className='p-5 relative z-10 flex-1'>
                  {/* Community header and profile image section */}
                  <div className='flex items-center gap-4 my-2'>
                    <div className='w-12 h-12 rounded-full bg-lightOrange flex items-center justify-center overflow-hidden border-2 border-yellow'>
                      <img src={community.icon || '/placeholder.svg'} alt='' className='w-8 h-8' />
                    </div>
                    <h3 className='font-bold text-xl text-gray-800'>{community.name}</h3>
                  </div>

                  <Separator className='my-3 bg-lightOrange opacity-50' />

                  {/* Community follower and tag section */}
                  <div className='flex justify-between items-center my-3'>
                    {/* Member count */}
                    <div className='flex items-center'>
                      <Users className='w-5 h-5 mr-2 text-yellow-600' />
                      <p className='text-lg font-semibold text-gray-700'>
                        {community.members.toLocaleString()} members
                      </p>
                    </div>

                    {/* Tag */}
                    <div
                      className={`px-3 py-1.5 rounded-full flex items-center text-sm font-medium ${getTagColor(
                        community.tag
                      )}`}>
                      {getTagIcon(community.tag)}
                      <span>{community.tag}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className='text-left mt-4'>
                    <h4 className='font-semibold text-lg text-gray-800 mb-1'>About this community</h4>
                    <p className='text-gray-700'>{community.description}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className='mt-4 relative z-10'>
                  <button className='w-full py-4 bg-lightOrange hover:bg-orange transition-all duration-300 ease-in-out text-black font-bold text-lg flex items-center justify-center gap-2 group'>
                    {community.cta}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1,
                        repeat: isHovered === index ? Number.POSITIVE_INFINITY : 0,
                        repeatType: 'loop',
                      }}>
                      →
                    </motion.span>
                  </button>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='flex justify-center mt-6 gap-4 pr-7'>
          <CarouselPrevious className='static transform-none bg-lightOrange hover:bg-orange text-black border-2 border-black rounded-full w-12 h-12 md:w-14 md:h-14' />

          <div className='flex items-center gap-2'>{/* Not Ready Yet */}</div>

          <CarouselNext className=' static transform-none bg-lightOrange hover:bg-orange text-black border-2 border-black rounded-full w-12 h-12 md:w-14 md:h-14' />
        </div>
      </Carousel>
    </section>
  );
}
