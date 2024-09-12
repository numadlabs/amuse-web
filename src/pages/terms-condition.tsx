import React from "react";
import AuthenticatedLayout from "@/components/layout/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TermsCondition = () => {
  const data = [
    {
      title: "What is Amuse Bouche?",
      text: "Amuse Bouche is a restaurant loyalty app where users earn bitcoin for checking into restaurants and receive perks for being regular customers.",
    },
    {
      title: "What are Membership Cards?",
      text: "Membership Cards represent subscriptions to your favorite restaurants. Easily browse and add Membership Cards on the Discover page to explore participating restaurants in your area.",
    },
    {
      title: "How do I earn rewards with Amuse Bouche?",
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
    <AuthenticatedLayout headerTitle="Terms and Conditions" headerType="page">
      <div className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-6 mb-24">
              <p className="text-md text-gray100">
                Welcome to Amuse Bouche! We are excited to welcome you to our
                growing community!
              </p>
              <p className="text-md text-gray100">
                We&apos;re thrilled to have you join our Pilot Program, and we
                greatly appreciate your participation. This program allows us to
                refine Amuse Bouche&apos;s features, ensuring it becomes the best
                experience possible for our entire community, including you!
              </p>
              <p className="text-md text-gray100">
                Here at Amuse Bouche, we value transparency with our users. So,
                please note that while using the Amuse Bouche Application,
                certain user data will be collected. To enable account creation
                and continued user access, it is necessary that user email data
                is collected. Additionally, user experience is unique to each
                location, which requires user location data to also be
                collected.
              </p>
              <p className="text-md text-gray100">
                Aside from user email and location data collection, the rest is
                up to you! You can opt to allow the collection of data such as
                your birthday and profile picture. Opting-in allows us here at
                Amuse Bouche to continue to improve the Application so we can
                provide a more seamless and tailored user experience for you.
              </p>
              <p className="text-md text-gray100">
                Your privacy is important, and what data you choose to disclose
                is totally up to you! To change your data collection
                preferences, you can go to the privacy section of the settings
                menu and view the data collection options.
              </p>
              <p className="text-md text-gray100">
                One final note, to ensure security and smooth operations during
                the Pilot Program, some features will be limited. Specifically,
                you won&apos;t be able to withdraw or transfer any bitcoin earned
                until the Pilot Program ends. We&apos;ll notify all users via email
                and app notification as soon as the Pilot Program is completed.
              </p>
              <p className="text-md text-gray100">
                We are excited to have you as a part of our growing community!
              </p>
            </div>
          </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default TermsCondition;
