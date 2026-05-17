import React from "react";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

// Internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import PageHeader from "@component/header/PageHeader";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Faq = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const faqItems = [
    { questionKey: "faq_one", answerKey: "description_one" },
    { questionKey: "faq_two", answerKey: "description_two" },
    { questionKey: "faq_three", answerKey: "description_three" },
    { questionKey: "faq_four", answerKey: "description_four" },
    { questionKey: "faq_five", answerKey: "description_five" },
    { questionKey: "faq_six", answerKey: "description_six" },
    { questionKey: "faq_seven", answerKey: "description_seven" },
    { questionKey: "faq_eight", answerKey: "description_eight" },
  ];

  return (
    <Layout title="שאלות ותשובות" description="עמוד שאלות ותשובות - שוברים שוק">
      <PageHeader
        headerBg={storeCustomizationSetting?.faq?.header_bg}
        title={showingTranslateValue(storeCustomizationSetting?.faq?.title)}
      />
      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 py-10 lg:py-12">
          <div className="grid gap-4 lg:mb-8 items-center md:grid-cols-2 xl:grid-cols-2">
            <div className="pr-16">
              <Image
                width={720}
                height={550}
                src={storeCustomizationSetting?.faq?.left_img || "/faq.svg"}
                alt="logo"
              />
            </div>
            <div>
              {faqItems.map(({ questionKey, answerKey }, index) => {
                const question = showingTranslateValue(storeCustomizationSetting?.faq?.[questionKey]);
                const answer = showingTranslateValue(storeCustomizationSetting?.faq?.[answerKey]);

                if (!question?.trim()) return null;

                return (
                  <Disclosure as="div" className="mt-2" key={index}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-base font-medium text-left text-gray-600 focus:text-customRed bg-gray-50 hover:bg-customRed-superLight rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                          <span>{question}</span>
                          <ChevronUpIcon
                            className={`${open ? "transform rotate-180 text-customRed" : ""
                              } w-5 h-5 text-gray-500`}
                          />
                        </Disclosure.Button>
                        {answer?.trim() && (
                          <Disclosure.Panel className="px-4 pt-3 pb-8 text-sm leading-7 text-gray-500">
                            {answer}
                          </Disclosure.Panel>
                        )}
                      </>
                    )}
                  </Disclosure>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
