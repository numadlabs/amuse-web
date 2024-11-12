import React from "react";
import AuthenticatedLayout from "@/components/layout/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const data = [
    {
      title: "What is Lumi?",
      text: "Lumiis a restaurant loyalty app where users earn bitcoin for checking into restaurants and receive perks for being regular customers.",
    },
    {
      title: "What are Membership Cards?",
      text: "Membership Cards represent subscriptions to your favorite restaurants. Easily browse and add Membership Cards on the Discover page to explore participating restaurants in your area.",
    },
    {
      title: "How do I earn rewards with Lumi?",
      text: "You earn bitcoin and extra perks by scanning a QR code and thereby checking into restaurants on the check-in page. The more you visit, the more you'll be rewarded.",
    },
    {
      title: "Do I need to deal with crypto wallets?",
      text: "No, there's no need for crypto wallet complexity. Your bitcoin rewards are managed within the app.",
    },
    {
      title: "How do I redeem my rewards?",
      text: "You can redeem your rewards directly within the app for various perks offered by participating restaurants.",
    },
  ];

  return (
    <AuthenticatedLayout headerTitle="FAQ" headerType="page">
      <div className="pt-4">
        <Accordion type="single" collapsible className="flex flex-col gap-4">
          {data.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-gray400 rounded-2xl p-4 bg-gradient-to-b from-gray500 to-transparent flex flex-col gap-3">
              <AccordionTrigger className="text-gray00 text-lg font-semibold">{item.title}</AccordionTrigger>
              <AccordionContent className="text-gray100 text-md">{item.text}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AuthenticatedLayout>
  );
};

export default Faq;