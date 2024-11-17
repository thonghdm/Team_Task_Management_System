// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const AnimationDone = () => {
//     const [isCompleted, setIsCompleted] = useState(false);
  
//     const handleComplete = () => {
//       setIsCompleted(true);
//       setTimeout(() => setIsCompleted(false), 2000);
//     };
  
//     const birdVariants = {
//       initial: { 
//         scale: 1,
//         y: 0,
//         opacity: 1 
//       },
//       animate: { 
//         scale: 0,
//         y: -200,
//         opacity: 0,
//         transition: {
//           duration: 1.5,
//           ease: "easeOut"
//         }
//       }
//     };
  
//     const tailVariants = {
//       animate: {
//         rotate: [-5, 5],
//         transition: {
//           duration: 0.5,
//           repeat: Infinity,
//           repeatType: "reverse"
//         }
//       }
//     };
  
//     const rainbowColors = [
//       "#FF0000",
//       "#FF7F00",
//       "#FFFF00",
//       "#00FF00",
//       "#0000FF",
//       "#4B0082",
//       "#8F00FF"
//     ];
  
//     return (
//       <div className="relative min-h-[400px] w-full bg-gray-900 p-8">
//         <AnimatePresence>
//           {isCompleted && (
//             <motion.div
//               className="absolute left-1/2 top-1/2"
//               style={{ x: "-50%", y: "-50%" }}
//             >
//               <motion.svg
//                 width="120"
//                 height="120"
//                 viewBox="0 0 120 120"
//                 variants={birdVariants}
//                 initial="initial"
//                 animate="animate"
//               >
//                 {/* Bird body */}
//                 <motion.path
//                   d="M60 30C60 30 40 35 30 45C20 55 20 70 30 80C40 90 60 85 60 85C60 85 80 90 90 80C100 70 100 55 90 45C80 35 60 30 60 30Z"
//                   fill="#FF4444"
//                 />
                
//                 {/* Rainbow tail segments */}
//                 {rainbowColors.map((color, index) => (
//                   <motion.path
//                     key={color}
//                     variants={tailVariants}
//                     animate="animate"
//                     d={`M${60 - index * 4} ${85 + index * 4}C${60 - index * 4} ${85 + index * 4} ${70 - index * 4} ${95 + index * 4} ${60 - index * 4} ${105 + index * 4}`}
//                     stroke={color}
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                 ))}
//               </motion.svg>
  
//               {/* Confetti particles */}
//               {Array.from({ length: 20 }).map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="absolute w-2 h-2 rounded-full"
//                   style={{
//                     backgroundColor: rainbowColors[i % rainbowColors.length],
//                   }}
//                   initial={{ 
//                     x: 0,
//                     y: 0,
//                     scale: 1,
//                     opacity: 1
//                   }}
//                   animate={{
//                     x: Math.random() * 200 - 100,
//                     y: Math.random() * 200 - 100,
//                     scale: 0,
//                     opacity: 0,
//                   }}
//                   transition={{
//                     duration: 1 + Math.random(),
//                     ease: "easeOut"
//                   }}
//                 />
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   };

// export default AnimationDone;