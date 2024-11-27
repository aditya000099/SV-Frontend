import React from "react";
import { CheckCircle, Code, ArrowRight, Star, Users, Zap } from "lucide-react";
import BackgroundPlus from "../ui/PlusGrid";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { BackgroundBeams } from "@/components/ui/background-beams";
import FUIFeatureSectionWithCards from "../../CardPatterns/FeaturesCard";
import BrainWireEffect from "CardPatterns/BrainCard";

const slap = {
  initial: {
    opacity: 0,
    scale: 1.1,
  },
  whileInView: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
  viewport: { once: true },
};

const HomePage = () => {
  return (
    <div className="bg-zinc-950 text-white">
      {/* Hero Section - Updated */}
      <div className="relative bg-zinc-900/30">
        <BackgroundPlus />
        <div className="container mx-auto grid min-h-screen items-center gap-12 px-4 py-20 md:grid-cols-2 lg:gap-20">
          <div className="relative z-10 flex flex-col gap-6">
            <motion.div
              {...{
                ...slap,
                transition: { ...slap.transition, delay: 0.2 },
              }}
              className="flex items-center gap-2 text-sm text-[#ab88fe]"
            >
              <Star className="h-4 w-4" />
              <span>Trusted by 10,000+ learners</span>
            </motion.div>
            <motion.h1
              {...{
                ...slap,
                transition: { ...slap.transition, delay: 0.2 },
              }}
              className="font-poppins mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]  bg-clip-text text-4xl tracking-tighter  sm:text-5xl text-transparent md:text-6xl lg:text-7xl"
            >
              Your Gateway To,{" "}
              
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-zinc-300">
                Endless Learning
              </span>
            </motion.h1>
            <motion.p
              {...{
                ...slap,
                transition: { ...slap.transition, delay: 0.2 },
              }}
              className="text-lg text-zinc-400"
            >
              Unlock your full potential with StudyVerse — a dynamic platform
              that empowers learners to access interactive courses, AI-driven
              support, and a global community. Start your journey today and
              transform the way you learn!
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <button
                size="lg"
                className="bg-[#ab88fe] hover:bg-[#8255ff] px-2 py-2 rounded-xl"
              >
                Start Building
              </button>
              <button
                size="lg"
                variant="outline"
                className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800"
              >
                View Documentation
              </button>
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#ab88fe]" />
                <span>Free Tier Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#ab88fe]" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>
          <motion.div
            {...{
              ...slap,
              transition: { ...slap.transition, delay: 0.2 },
            }}
            className="relative h-[500px] w-full"
          >
          
            {/* Decorative Background Circles */}
            <div className="absolute -left-8 -top-8 h-72 w-72 rounded-full bg-[#ab88fe]/20 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-[#8255ff]/20 blur-3xl" />

            {/* Main Content Wrapper */}
            <div className="relative h-full w-full overflow-hidden rounded-xl border-zinc-000">
              {/* Bottom Box */}
              <div className="absolute flex justify-center items-center bottom-0 right-0 w-1/3 h-14 bg-zinc-900 rounded-3xl shadow-xl z-10">
                <h2 className="font-poppins mx-auto font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r to-purple-300 from-zinc-300">
                  Studyverse
                </h2>
              </div>

              {/* Spline Component */}
              <BrainWireEffect />
              {/* <Spline scene="https://prod.spline.design/9YaOax3ND6dGm57I/scene.splinecode" /> */}
            </div>
          </motion.div>

          {/* <motion.div
					{...{
						...slap,
						transition: { ...slap.transition, delay: 0.2 },
					}} className="relative h-[500px] w-full">
          <div className="absolute -left-8 -top-8 h-72 w-72 rounded-full bg-[#ab88fe]/20 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-[#8255ff]/20 blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-xl border-zinc-000  ">
          <Spline scene="https://prod.spline.design/9YaOax3ND6dGm57I/scene.splinecode" />
 
            {/* <img
              fill
              alt="Platform preview"
              src="/hero1.png"
              className="object-cover"
            /> */}
          {/* </div> */}
          {/* </motion.div>  */}
        </div>
      </div>

      {/* Features - Updated */}
      <div className="relative border-zinc-800 bg-zinc-900/30">
      
        <div className="container mx-auto px-4 py-24 lg:py-32">
        
          <div className="mb-16 sm:gap-48 grid gap-8 md:grid-cols-2">
          {/* <BackgroundBeams /> */}
            <div>
              <div className="mb-6 inline-block rounded-full bg-zinc-800 px-4 py-1 text-sm text-[#ab88fe]">
                The StudyVerse Platform
              </div>
              <h2 className="mb-6 font-quicksand text-4xl font-bold sm:text-5xl">
                Begin your next learning journey with{" "}
                <span className="bg-gradient-to-r from-[#8255ff] to-[#ab88fe] bg-clip-text text-transparent">
                  Studyverse
                </span>
              </h2>
              <p className="text-lg text-zinc-400">
                Experience the perfect blend of knowledge and innovation.
                StudyVerse offers everything you need to learn, grow, and
                connect with a global community of learners, all in one place.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Topic-wise Chatrooms",
                  "24/7 online support",
                  "Real-time CanvasChat",
                  "AI Question Bot",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#ab88fe]" />
                    <span className="text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-2/3">
              <div className="absolute -right-4 top-4 h-36 w-36 rounded-full bg-[#ab88fe]/40 blur-3xl" />
              <div className="relative overflow-hidden rounded-xl border-zinc-800 bg-zinc-900/70 shadow-2xl">
                <img
                  alt="Platform interface"
                  src="/svlogo.png"
                  className="p-4"
                />
              </div>
            </div>
          </div>
        </div>
        
        <ShootingStars />
      <StarsBackground />
      </div>

      {/* Features Grid */}
      {/* <div className="bg-zinc-900/50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Zap className="h-6 w-6 text-[#ab88fe]" />,
                title: "Lightning Fast",
                description: "Start learning anything new just right away!",
              },
              {
                icon: <Code className="h-6 w-6 text-[#ab88fe]" />,
                title: "Beginners First",
                description:
                  "Clean Design, great DX, and full customization control",
              },
              {
                icon: <Users className="h-6 w-6 text-[#ab88fe]" />,
                title: "User Friendly",
                description:
                  "Intuitive interface for both creators and respondents",
              },
            ].map((feature, index) => (
              <div key={index} className="border-none bg-zinc-900/50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-hidden overflow-y-hidden">
						<div
							className="absolute left-0 top-[60%] h-32 w-[90%] overflow-x-hidden bg-[rgb(54,157,253)] bg-opacity-20  blur-[337.4px]"
							style={{ transform: "rotate(-30deg)" }}
						/>
					</div>
        </div>
      </div> */}
      <FUIFeatureSectionWithCards />

      {/* Stats Section */}
      <div className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
          {[
            { number: "50K+", label: "Learners" },
            { number: "1M+", label: "Errors solved" },
            { number: "99.9%", label: "Customers Happy" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#ab88fe]">
                {stat.number}
              </div>
              <div className="mt-2 text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
        
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to transform your learning process?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-zinc-400">
            Join thousands of learners who are already learning more efficiently
            with Studyverse.
          </p>
          <button size="lg" className="bg-[#ab88fe] hover:bg-[#8255ff]">
            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-gradient-to-b from-[rgba(100,101,240,0.5)] to-[rgba(136,70,200,0.5)] blur-[100px]" />
      </div>
    </div>
  );
};

export default HomePage;
