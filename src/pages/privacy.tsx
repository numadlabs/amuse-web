import AuthenticatedLayout from "@/components/layout/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const data = [
  {
    title: "Data Collection",
    text: `a. The Platform collects two types of data from its users: necessary data collection which cannot be disabled and optional data collection which may be enabled/disabled at your discretion.  

b. Necessary Data Collection 
	I. Location: We use location data to assist you in locating restaurants participating in a program on the Platform. We may store location data to improve and optimize the Platform. 
	II. Email: We will store and use your email for account creation, user login, password management and Platform-to-user communications.

c. Optional Data Collection
	I. Birthday: We use birthday data to allow us to offer you a special birthday promotion or reward. 
	II. Profile Picture: You may opt to add a profile picture in order to personalize your profile. If added, the Platform will automatically store the data. `,
  },
  {
    title: "General Data Protection Regulation",
    text: `a. Our legal basis for collecting and using the data is for one or more of the following purposes:
	I. We need to perform a contract with you.
	II. You have given us permission to do so. 
	III. The processing is in our legitimate interest, and it is not overridden by your rights. 
	IV. It is necessary for payment processing purposes. 
	V. It is necessary to comply with the law. `,
  },
  {
    title: "Data Retention and Disclosure",
    text: `a. We will retain data only for as long as is necessary for the purposes as stated in this policy.

b. Disclosure of your data may occur for one or more of the following reasons:
	I. The Platform is involved in a merger, acquisition or asset sale. 
	II. We are required by law to disclose your data. 
	III. We have a good faith belief that it is necessary to disclose your data in relation to the protection of the Platform and/or legal matters, both potential and active. `,
  },
  {
    title: "Data Protection",
    text: `a. The security of your data is important to us, and we strive to use all commercially reasonable means to protect your data. However, we do not guarantee absolute security of your data.`,
  },
  {
    title: "User Rights",
    text: `a. You have the following rights regarding your data: 
	I. Access: You can request access to the data of yours that we have collected. 
	II. Rectification: You have the right to have your information corrected
that information is inaccurate or incomplete. 
	III. Objection: You have the right to request that we restrict the processing of your data. 
	IV. Portability: You have the right to be provided with a copy of your data that we have collected. 
	V. Withdraw Consent: You have the right to withdraw your consent at any time to the collection of your data. 
`,
  },
];

const Privacy = () => {
  return (
    <AuthenticatedLayout headerTitle="Privacy policy" headerType="page">
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col mx-2 gap-2">
          <p className="text-lg text-gray00 font-bold">Disclaimer</p>
          <p className="text-sm text-gray100">
            By using the Amuse Bouche application platform platform, you agree
            to the collection and use of information in accordance with this
            policy.
          </p>
        </div>
        <Accordion type="single" collapsible className="flex flex-col gap-4">
          {data.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray400 rounded-2xl p-4 bg-gradient-to-b from-gray500 to-transparent flex flex-col gap-3"
            >
              <AccordionTrigger className="text-gray00 text-lg font-semibold">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-gray100 text-md">
                {item.text}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AuthenticatedLayout>
  );
};

export default Privacy;
