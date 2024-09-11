import { Location } from "iconsax-react";
import { Check } from "lucide-react";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const UnOwned = () => {
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
      <section className="flex flex-col gap-4 justify-center mt-6">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-bold text-lg text-white">Rewards</h1>
          <div className="flex gap-3">
            <Check color={"#ffff"} size={20} />
            <h2 className="font-normal text-lg text-gray50">
              Earn Bitcoin for every visit
            </h2>
          </div>
          <div className="flex gap-3 w-full">
            <Check color={"#ffff"} size={20} />
            <h2 className="font-normal text-lg text-gray50">
              Complimentary bites along the way
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-lg text-white">Locations</h1>
          <div className="flex gap-3">
            <Location color="#ffffff" size={20} />
            <h2 className="font-normal text-lg text-systemInformation">
              Earn Bitcoin for every visit
            </h2>
          </div>
        </div>
        <div className="grid gap-4">
          <h1 className="font-bold text-lg text-white">About</h1>
          <div className="flex gap-3">
            <h2 className="font-normal text-lg text-gray50">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum euismod dictum nulla, et scelerisque libero ultricies
              sed. Maecenas vitae euismod massa, sit amet imperdiet quam.
            </h2>
          </div>
        </div>
        <div className="w-full max-w-md mx-auto bg-background text-white rounded-lg">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="timetable">
              <AccordionTrigger className="flex justify-between items-center">
                <span className="font-bold text-lg text-white">Timetable</span>
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
              Open your app to the homepage, scan the QR code from your waiter
              or hostess, and earn rewards for checking in. Activate power-ups
              for extra rewards.
            </h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default UnOwned;
