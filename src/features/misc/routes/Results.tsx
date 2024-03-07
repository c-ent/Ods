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

  
  if (percentage === null) {
    return <div className='flex h-screen w-screen items-center justify-center animate-spin'>
           <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.8975 1.08749C28.065 1.35749 27.585 1.83749 27.3525 2.62124C27.2213 3.05999 27.1988 4.07999 27.1988 9.40499C27.1988 16.4587 27.1913 16.3687 27.9113 17.0887C28.875 18.0487 31.125 18.0487 32.0888 17.0887C32.8088 16.3687 32.8013 16.4587 32.8013 9.40499C32.8013 2.57999 32.79 2.45999 32.235 1.79999C31.77 1.24874 31.2713 1.06499 30.15 1.03499C29.5988 1.01999 29.0363 1.04249 28.8975 1.08749ZM10.3238 8.49749C9.73128 8.76749 8.85753 9.62249 8.55378 10.23C8.23878 10.8637 8.22378 11.5687 8.50878 12.1987C8.78628 12.8175 17.5013 21.5625 18.1875 21.9112C19.1588 22.41 20.1563 22.1662 21.1613 21.1837C22.1513 20.2162 22.4138 19.1662 21.9113 18.1875C21.5625 17.5012 12.8175 8.78624 12.1988 8.50874C11.6288 8.24999 10.8788 8.24624 10.3238 8.49749ZM48.1988 8.55749C47.7375 8.77124 46.95 9.50999 43.1925 13.2787C39.7388 16.74 38.685 17.8575 38.5163 18.225C38.2313 18.8437 38.235 19.56 38.52 20.1675C38.7825 20.73 39.645 21.615 40.2263 21.9187C40.815 22.2262 41.6888 22.2225 42.3 21.9112C42.9263 21.5887 51.5888 12.9262 51.9113 12.3C52.2225 11.6925 52.2263 10.815 51.9225 10.2337C51.615 9.64499 50.82 8.86499 50.22 8.56124C49.5488 8.21999 48.93 8.21999 48.1988 8.55749ZM2.62128 27.345C1.51503 27.6937 0.967529 28.575 0.967529 29.9962C0.971279 31.4475 1.51128 32.3175 2.61753 32.6475C3.06003 32.7787 4.04628 32.8012 9.40503 32.8012C14.9888 32.8012 15.735 32.7825 16.1925 32.6325C16.8675 32.415 17.415 31.8675 17.6325 31.1925C17.955 30.1987 17.7938 28.7887 17.28 28.0912C17.1675 27.9412 16.845 27.69 16.5638 27.5362L16.05 27.2512L9.55128 27.2287C4.32003 27.2137 2.96628 27.2362 2.62128 27.345ZM44.0438 27.2925C43.5825 27.405 42.945 27.7912 42.72 28.095C42.2063 28.7887 42.045 30.1987 42.3675 31.1925C42.585 31.8675 43.1325 32.415 43.8075 32.6325C44.265 32.7825 45.0113 32.8012 50.595 32.8012C55.9538 32.8012 56.94 32.7787 57.3825 32.6475C58.4888 32.3175 59.0288 31.4475 59.0325 29.9962C59.0325 28.5525 58.4813 27.6862 57.3375 27.3412C56.9513 27.225 55.74 27.2025 50.61 27.21C47.1675 27.2175 44.2125 27.255 44.0438 27.2925ZM18.1988 38.5575C17.7375 38.7712 16.95 39.51 13.1925 43.2787C9.73878 46.74 8.68503 47.8575 8.51628 48.225C8.23128 48.8437 8.23503 49.56 8.52003 50.1675C8.78253 50.73 9.64503 51.615 10.2263 51.9187C10.815 52.2262 11.6888 52.2225 12.3 51.9112C12.9263 51.5887 21.5888 42.9262 21.9113 42.3C22.2225 41.6925 22.2263 40.815 21.9225 40.2337C21.615 39.645 20.82 38.865 20.22 38.5612C19.5488 38.22 18.93 38.22 18.1988 38.5575ZM40.3238 38.4975C39.7313 38.7675 38.8575 39.6225 38.5538 40.23C38.2388 40.8637 38.2238 41.5687 38.5088 42.1987C38.7863 42.8175 47.5013 51.5625 48.1875 51.9112C49.1588 52.41 50.1563 52.1662 51.1613 51.1837C52.1513 50.2162 52.4138 49.1662 51.9113 48.1875C51.5625 47.5012 42.8175 38.7862 42.1988 38.5087C41.6288 38.25 40.8788 38.2462 40.3238 38.4975ZM29.0438 42.2887C28.575 42.4087 27.9413 42.795 27.72 43.095C27.2025 43.7925 27.1988 43.8412 27.1988 50.5837C27.1988 55.9537 27.2213 56.94 27.3525 57.3825C27.6825 58.4887 28.5563 59.0287 30 59.0287C31.4438 59.0287 32.3175 58.4887 32.6475 57.3825C32.88 56.5875 32.8763 44.5312 32.64 43.8375C32.415 43.1775 32.1563 42.8625 31.575 42.5475C31.1625 42.3225 30.9225 42.2662 30.2138 42.24C29.7375 42.2212 29.2125 42.2437 29.0438 42.2887Z" fill="#FFEFD8"/>
</svg>


            </div>;
  }

  
  return (
    <div className='p-5 h-screen w-screen flex flex-col justify-center items-center text-center space-y-8'>


      <div className="border-r h-[70px] md:h-[120px] border-white my-4"></div>
      <h2>you're a</h2>
      {/* <h1 className='font-bold'></h1> */}

      <motion.h1
    // className="max-w-lg mb-6 font-bold bg-gradient-to-b from-white via-[#b9b9b9c5] to-white text-transparent bg-clip-text"
    className="result-main-txt mb-6 font-bold text-gradient-result text-transparent bg-clip-text"
    // initial={{ opacity: 0 }}
    // animate={{ opacity: 1, y: ["0%", "1%", "0%"] }}
    // transition={{
    //   opacity: { duration: 3, ease: "easeOut" },
    //   y: { duration: 2, ease: "easeInOut", repeat: Infinity }
    // }}
  >
   {title}
  </motion.h1>
 
      <p className='max-w-xl text-sm md:text-md pt-5 '>{description}</p>
      <motion.img 
       initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: ["0%", "5%", "0%"] }}
    transition={{
      opacity: { duration: 3, ease: "easeOut" },
      y: { duration: 3, ease: "easeInOut", repeat: Infinity }
    }}
      src={file} alt={title} 
      />

    {/* <p className='text-sm pt-5 '>
        {percentage.toFixed(1)}% of users got the result {title}
        
    </p> */}

 {percentage !== null && <p className='text-sm pt-5 '>{percentage.toFixed(1)}% of users got the result {title}</p>}
      <p className='max-w-md text-xs italic m-0 pt-5  '> "And, when you want something, all the universe conspires in helping you to achieve it"</p>
      
    
    </div>
  );
}