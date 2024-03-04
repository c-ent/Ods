import { useParams } from 'react-router-dom';
import DreamChaserSvg from '../../../../public/svg/DreamChaserSvg.svg';
import RiskTakerSvg from '../../../../public/svg/RiskTakerSvg.svg';
import SteadySailerSvg from '../../../../public/svg/SteadySailerSvg.svg';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://hrnwpmdsdxqtyzgsvowv.supabase.co'
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybndwbWRzZHhxdHl6Z3N2b3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NDgxMDQsImV4cCI6MjAyNTEyNDEwNH0.qhuj1yTWWmT5l0IgdoIEluGhBhu8OMyg0NzPMTI8WV8`
const supabase = createClient(supabaseUrl, supabaseKey)

type CategoryData = {
  [key: string]: {
    title: string;
    description: string;
    file: string;
  };
};

const categoryData:CategoryData = {
  'dream': {
    title: "Dream Chaser",
    description: `You pursue your deepest aspirations, driven by the vision of what you want to achieve in life. Whether it's a career goal, a creative endeavor, or a personal ambition, you relentlessly strive to turn your dreams into reality.`,
    file: DreamChaserSvg,
  },
  'soul': {
    title: "Soul Searcher",
    description: `You embrace change as the catalyst for growth and transformation on your quest to discover your personal legend. Through introspection and exploration, you unravel the layers of your being, unearthing the true essence of your existence.`,
    file: RiskTakerSvg,
  },
  'adventure': {
    title: "Voyager",
    description: `You fearlessly delve into the uncharted territories of life, seeking wisdom amidst the mysteries of the unknown. Every step you take is infused with curiosity and a thirst for knowledge, for you understand that true enlightenment lies in the depths of exploration.`,
    file: SteadySailerSvg,
  },
};


export const Results = () => {
  const { category } = useParams<{ category: string }>();
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    const getResults = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('results')
        .select('category, count');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return;
      }

      const totalCount = categoriesData.reduce((total, categoryData) => total + categoryData.count, 0);
      const categoryCount = categoriesData.find(categoryData => categoryData.category === category)?.count || 0;
      const categoryPercentage = (categoryCount / totalCount) * 100;

      setPercentage(categoryPercentage);
    };

    getResults();
  }, [category]);


  if (!category) {
    return <div>Oops</div>;
  }

  const categoryInfo = categoryData[category];


  if (!categoryInfo) {
    return <div>Category not found</div>;
  }

  const { title, description, file } = categoryInfo;

  


  
  return (
    <div className='p-5 h-screen w-screen flex flex-col justify-center items-center text-center space-y-5'>


      <div className="border-r h-[100px] md:h-[120px] border-white my-4"></div>
      <h2>you're a</h2>
      {/* <h1 className='font-bold'></h1> */}

      <motion.h1
    // className="max-w-lg mb-6 font-bold bg-gradient-to-b from-white via-[#b9b9b9c5] to-white text-transparent bg-clip-text"
    className="result-main-txt max-w-lg mb-6 font-bold text-gradient-result text-transparent bg-clip-text"
    // initial={{ opacity: 0 }}
    // animate={{ opacity: 1, y: ["0%", "1%", "0%"] }}
    // transition={{
    //   opacity: { duration: 3, ease: "easeOut" },
    //   y: { duration: 2, ease: "easeInOut", repeat: Infinity }
    // }}
  >
   {title}
  </motion.h1>
 
      <p className='max-w-xl text-sm md:text-md'>{description}</p>
      <motion.img 
       initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: ["0%", "5%", "0%"] }}
    transition={{
      opacity: { duration: 3, ease: "easeOut" },
      y: { duration: 3, ease: "easeInOut", repeat: Infinity }
    }}
      src={file} alt={title} 
      />
      {percentage !== null && <p className='text-sm'>{percentage.toFixed(1)}% of users got the result {title}</p>}
      <p className='max-w-md text-xs italic'> And, when you want something, all the universe conspires in helping you to achieve it.</p>
      
    
    </div>
  );
}