"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const faqs = [
  "What should I upload to improve my ratings?",
  "What do visitors choose when booking a tour guide?",
  "What does a tour guide agency mean?",
  "How to prepare for a high-profile guest?",
  "What if a guest is not cooperative?",
  "How do I see my ratings?",
  "How do I see my trips?",
  "How do I get paid on time?",
  "Who owns 4ON4?",
  "How to use 4ON4 Cloud and AI?",
  "How do I access trip documents?",
  "Which agency sponsors 4ON4?",
  "When was 4ON4 founded?",
];

export default function FAQsPage() {
  const router = useRouter();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">FAQs</h1>

      {faqs.map((q, i) => (
        <button
          key={i}
          onClick={() => router.push(`/user/app/faqs/${i}`)}
          className="w-full flex justify-between items-center text-sm py-3"
        >
          <span>{q}</span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      ))}
    </div>
  );
}
