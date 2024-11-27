import { GlareCard } from "./Glare";
import React from "react";
import { MessageCircle, Search } from "lucide-react";
import { CheckCircle, Code, ArrowRight, Star, Users, Zap, ArrowUpRight } from "lucide-react";
import { Link } from 'react-router-dom';

export default function FUIFeatureSectionWithCards() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-[#ab88fe]" />,
      title: "Lightning Fast",
      desc: "Start learning anything new just right away! No need to wait for the next release.",
    },
    {
      icon: <Code className="h-6 w-6 text-[#ab88fe]" />,
      title: "Beginners First",
      desc: "Clean Design, great DX, and full customization control",
    },
    {
      icon: <Users className="h-6 w-6 text-[#ab88fe]" />,
      title: "User Friendly",
      desc: "Intuitive interface for both creators and respondents",
    },
  ];

  return (
    <section
      id="features"
      className="overflow-hidden relative w-full max-lg:after:hidden mt-10"
    >
      {/* <img
        src="/tailwind-bg-gradient.avif"
        className="absolute -top-0 left-10 opacity-40 z-2"
      /> */}
      <div className="relative ">
        <div className="flex relative flex-col px-4 mx-auto max-w-screen-xl md:px-0">
          <div className="relative mx-auto mb-5 space-y-4 max-w-3xl text-center">
            <h2 className="pt-16 text-4xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr via-white md:text-5xl lg:text-6xl font-nomral font-geist from-zinc-400/50 to-white/60">
              A "Second brain" made for you... or your team
            </h2>

            <p className="text-zinc-400">
              Studyverse offers all the vital building blocks you need to
              transform your gold mine of content into a powerful knowledgebase
              for yourself, your team or even a group of friends!
            </p>
            
          </div>
          <section className="relative z-20 pb-14">
            <div className="px-4 mx-auto max-w-screen-xl text-gray-400 md:px-8 lg:px-0">
              <div className="relative mx-auto max-w-2xl sm:text-center">
                <div className="relative z-10">
                  <h3 className="mt-4 text-3xl font-normal tracking-tighter text-gray-200 sm:text-4xl md:text-5xl font-geist"></h3>
                </div>
                <div
                  className="absolute inset-0 mx-auto max-w-xs h-44 blur-[118px]"
                  style={{
                    background:
                      "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
                  }}
                ></div>
              </div>
              <div className="relative z-20 mt-[4rem]">
                <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((item, idx) => (
                    <GlareCard key={`l-${idx}`}>
                      <li
                        key={idx}
                        className="z-20 transform-gpu space-y-3 rounded-xl  bg-transparent/20 p-4 [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#8686f01f_inset]"
                      >
                        <div className="w-fit transform-gpu rounded-full p-4 text-purple-600 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]">
                          {item.icon}
                        </div>
                        <h4 className="text-lg font-bold tracking-tighter text-gray-300 font-geist">
                          {item.title}
                        </h4>
                        <p className="text-gray-500">{item.desc}</p>
                      </li>
                    </GlareCard>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <div className="overflow-x-hidden overflow-y-hidden">
            <div
              className="absolute left-0 top-[60%] h-32 w-[90%] overflow-x-hidden bg-[rgb(54,157,253)] bg-opacity-20  blur-[337.4px]"
              style={{ transform: "rotate(-30deg)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
