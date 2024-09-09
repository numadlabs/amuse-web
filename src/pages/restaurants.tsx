import APassStripes from "@/components/icons/apass-stripes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Location } from "iconsax-react";
import { Check, Info } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Restaurants = () => {
  const timetable = [
    { day: "Monday", hours: "12:00 - 23:00" },
    { day: "Tuesday", hours: "12:00 - 23:00" },
    { day: "Wednesday", hours: "12:00 - 23:00" },
    { day: "Thursday", hours: "12:00 - 23:00" },
    { day: "Friday", hours: "12:00 - 23:00" },
    { day: "Saturday", hours: "12:00 - 23:00" },
    { day: "Sunday", hours: "Closed" },
  ];
  return (
    <>
      <div className="bg-background h-screen w-full flex flex-col items-center">
        <ScrollArea className="h-[812px] w-[375px] flex flex-col items-center m-auto">
          {" "}
     <section className="flex flex-col justify-center items-center">
     <Card className="relative mt-4 w-[343px] h-[264px] overflow-hidden bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] flex items-center">
            <div className="flex flex-col gap-5 items-start p-5 z-50 w-full">
              <div className="flex justify-start gap-5">
                <div>
                  {" "}
                  <Image
                    src={"/images/LogoDark.png"}
                    alt="image"
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-white">
                    Choijin temple
                  </h1>
                  <h2 className="uppercase font-normal text-sm text-gray50">
                    mongolia
                  </h2>
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  {" "}
                  <Image
                    src={"/images/LogoDark.png"}
                    alt="image"
                    width={164}
                    height={164}
                    className="rounded-xl object-cover"
                  />
                </div>
                <div className="w-[123px] h-[164px] rounded-xl bg-gray500 border border-gray400">
                  <div className="flex flex-col justify-center items-center gap-1 h-[126px] border-b border-gray400">
                    <h1 className="font-bold text-4xl text-white">00</h1>
                    <h2 className="font-normal text-sm text-gray50">
                      Check-ins
                    </h2>
                  </div>
                  <div className="flex justify-center items-center gap-[6px] pt-2 pb-3">
                    <h1 className="font-bold text-md text-white">10</h1>
                    <h2 className="font-normal text-sm text-gray50">
                      Until a perk
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute z-10 -right-28 opacity-80">
              <APassStripes />
            </div>
          </Card>
          <div className="w-[343px]">
            <div className="mt-6 grid gap-4">
              <h1 className="font-bold text-lg text-white">Rewards</h1>
              <div className="flex gap-3">
                <Check color={"#ffff"} size={20} />
                <h2 className="font-normal text-lg text-gray50">
                  Earn Bitcoin for every visit
                </h2>
              </div>
              <div className="flex gap-3">
                <Check color={"#ffff"} size={20} />
                <h2 className="font-normal text-lg text-gray50">
                  Complimentary bites along the way
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <h1 className="font-bold text-lg text-white">Locations</h1>
              <div className="flex gap-3">
                <Location color="#ffffff" size={20} />
                <h2 className="font-normal text-lg text-systemInformation">
                  Earn Bitcoin for every visit
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <h1 className="font-bold text-lg text-white">About</h1>
              <div className="flex gap-3">
                <h2 className="font-normal text-lg text-gray50">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vestibulum euismod dictum nulla, et scelerisque libero
                  ultricies sed. Maecenas vitae euismod massa, sit amet
                  imperdiet quam.
                </h2>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto bg-background text-white rounded-lg">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="timetable">
                  <AccordionTrigger className="flex justify-between items-center">
                    <span className="font-bold text-lg text-white">
                      Timetable
                    </span>
                    <div className="flex items-center relative left-24 gap-[6px]">
                      <span className="relative w-2 h-2 p-1 bg-systemSuccess rounded-full"></span>
                      <span className="text-gray50 font-normal">Open</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {timetable.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
                        >
                          <span className="text-gray100 font-normal text-md">
                            {item.day}
                          </span>
                          <span className="text-gray50 font-normal text-md">
                            {item.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="mt-6 grid gap-4">
              <h1 className="font-bold text-lg text-white">How it works</h1>
              <div className="flex gap-3">
                <h2 className="font-normal text-lg text-gray50">
                  Open your app to the homepage, scan the QR code from your
                  waiter or hostess, and earn rewards for checking in. Activate
                  power-ups for extra rewards.
                </h2>
              </div>
            </div>
          </div>{" "}
     </section>
        </ScrollArea>
      </div>
    </>
  );
};

export default Restaurants;
