import {  useState } from 'react'
import { motion } from 'framer-motion';
import questionsorig from '../../../public/files/questions.json'; // Import the JSON data
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://hrnwpmdsdxqtyzgsvowv.supabase.co'
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybndwbWRzZHhxdHl6Z3N2b3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NDgxMDQsImV4cCI6MjAyNTEyNDEwNH0.qhuj1yTWWmT5l0IgdoIEluGhBhu8OMyg0NzPMTI8WV8`
const supabase = createClient(supabaseUrl, supabaseKey)

// const fs = import('fs');

const choiceToCategory: { [key: number]: string } = {
  1: "dream",
  2: "soul",
  3: "adventure",
};

// Function to shuffle an array
function shuffle(array:object[]) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

interface Question{
  id: number;
  question: string;
  choices: Choice[]; // Replace 'any' with the type of the choices if known
}

interface Choice {
  id: number;
  choice: string;
}

const questions = shuffle(questionsorig) as Question[]; // Shuffle the questions

export const Form = () => {
  

  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Start at the first question
  const [selectedChoices,setSelectedChoices] = useState<number[]>([]); // Store the selected choice IDs
  const [selectedChoice, setSelectedChoice] = useState<null | number>(null);
  
  const handleChoiceClick = (choiceId:number) => {
    setSelectedChoice(choiceId);
    setSelectedChoices(prevChoices => [...prevChoices, choiceId]); // Add the choice ID to the array
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedChoice(null); // Reset the selected choice when moving to the next question
    }, 1000);
  };

  
  const currentQuestion = questions[currentQuestionIndex]; // Get the current question


  if (currentQuestionIndex >= questions.length) {
    // All questions have been answered
    const categoryCounts = selectedChoices.reduce<{ [key: string]: number }>((counts, choiceId) => {
      const category = choiceToCategory[choiceId];
      return { ...counts, [category]: (counts[category] || 0) + 1 };
    }, {});
  
    const maxCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);
  
    // // Save the result to a JSON file
    // fs.writeFile('results.json', JSON.stringify(categoryCounts, null, 2), (err) => {
    //   if (err) throw err;
    //   console.log('Data written to file');
    // });

    const updateCategoryCount = async () => {
      // Fetch the current count of the maxCategory from the database

      
      const { data: currentCountData, error: fetchError } = await supabase
      .from('results')
      .select('count')
      .eq('category', maxCategory);
      if (fetchError) {
      console.error('Error fetching count:', fetchError);
      return;
      }

      const currentCount = currentCountData[0]?.count || 0;

      // Increment the count of the maxCategory in the database
      const { error: updateError } = await supabase
      .from('results')
      .update({ count: currentCount + 1 })
      .eq('category', maxCategory);

      if (updateError) {
      console.error('Error updating count:', updateError);
      return;
      }
      
    }

    updateCategoryCount()
    navigate(`/result/${maxCategory}`);
  }

  const variants = {
    initial: { opacity: 0, scale: 1 },
    animate: { opacity: 1, scale: 1 },
    tap: { scale: 20 }, // Add a rotate property to the tap variant
    out: { opacity: 0 } // Add an out variant for the exit animation
  };
  

  
  return (
    <motion.div className='p-6 md:p-8 shadow-sm shadow-white text-center flex flex-col  items-center bg-gradient-to-br from-[#fdfdfd00] to-[#ffffff05] rounded-2xl h-full backdrop-blur-[5px]'
    animate={{  y: ["100%", "0%"] }}
    transition={{
      y: { duration: 2, ease: "easeInOut",  }
    }}
    >
      
      
      <div 
        className='flex flex-col gap-6'
       
      >
        <p>Question {currentQuestionIndex + 1} out of {questions.length}</p>
        {currentQuestion ? (
          <motion.h2
            key={`motion-h2-${currentQuestion.question}`}
            className='max-w-5xl underline decoration-1 underline-offset-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: ["0%", "3%", "0%"] }}
            transition={{
              opacity: { duration: 5, ease: "easeOut" },
            }}
          >
            {currentQuestion.question}
          </motion.h2>
        ) : (
          <p>No question available</p>
        )}
      </div>


<div className='flex-1 flex flex-col justify-center items-center gap-10 max-w-7xl'>
    <div className='flex flex-col md:flex-row justify-between gap-10 md:gap-20'>
    <motion.div 
          key={`motion-div-1-${currentQuestion?.choices?.[0]?.choice ?? 'default'}`}
          className=' max-w-xl flex  items-center cursor-pointer flex-1 gap-5 hover:-translate-y-3 transform transition duration-500'
          initial={{ opacity: 0 }}
          animate="animate"
  variants={variants} // Add the variants
  whileTap={{ scale: 10 }}
          transition={{
            opacity: { duration: 3, ease: "easeOut",delay:1 },
          }}
          onClick={() => handleChoiceClick(currentQuestion.choices[0].id)} // Add an onClick handler
          style={{ visibility: selectedChoice === null || selectedChoice === currentQuestion.choices[0].id ? 'visible' : 'hidden' }}// Hide the choice if it's not the selected choice
        >
        
          <p className='text-4xl '>
            α
          </p> 
          <h3>{currentQuestion?.choices?.[0]?.choice ?? 'No choices available'}</h3>
        </motion.div>

        <motion.div 
          key={`motion-div-2-${currentQuestion?.choices?.[1]?.choice ?? 'default'}`}
          className=' max-w-xl flex  items-center cursor-pointer flex-1 gap-5 hover:-translate-y-3 transform transition duration-500'
          initial={{ opacity: 0 }}
          animate="animate"
          variants={variants} // Add the variants
          whileTap={{ scale: 10 }}
          transition={{
            opacity: { duration: 3, ease: "easeOut",delay:2 },
          }}
          onClick={() => handleChoiceClick(currentQuestion.choices[1].id)} // Add an onClick handler
          style={{ visibility: selectedChoice === null || selectedChoice === currentQuestion.choices[1].id ? 'visible' : 'hidden' }} // Hide the choice if it's not the selected choice
        >
          <p className='text-4xl'>
          β
          </p>
          <h3>{currentQuestion?.choices?.[1]?.choice ?? 'No choices available'}</h3>

        </motion.div>
      </div>

      <div>
      <motion.div 
  key={`motion-div-3-${currentQuestion?.choices?.[2]?.choice ?? 'default'}`}
  className='max-w-xl flex items-center cursor-pointer flex-1 gap-5 hover:-translate-y-3 transform transition duration-500'
  initial="initial"
  animate="animate"
  variants={variants} // Add the variants
  whileTap={{ scale: 10 }}
  transition={{
    opacity: { duration: 3, ease: "easeOut", delay: 3 },
    rotate: { duration: 0.5 } // Add a transition for the rotate animation
  }}
  onClick={() => handleChoiceClick(currentQuestion.choices[2].id)} // Add an onClick handler
  style={{ visibility: selectedChoice === null || selectedChoice === currentQuestion.choices[2].id ? 'visible' : 'hidden' }}// Hide the choice if it's not the selected choice
  
>
  <p className='text-4xl'>
    γ
  </p>
  <h3>{currentQuestion?.choices?.[2]?.choice ?? 'No choices available'}</h3>

</motion.div>
      </div>
</div>

    </motion.div>
  )
}


