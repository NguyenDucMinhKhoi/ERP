import React from "react";
import ReviewCard from "./ReviewCard";

const sampleReviews = [
  { name: "Nguyen An", date: "Mar 2025", text: "Great instructors and clear curriculum. I improved my speaking significantly.", avatar: "/src/assets/react.svg" },
  { name: "Tran Binh", date: "Jan 2025", text: "Practical lessons and friendly teachers. Highly recommend for exam prep.", avatar: "/src/assets/react.svg" },
  { name: "Le Hoa", date: "Feb 2025", text: "Helpful feedback and a supportive community. My confidence increased!", avatar: "/src/assets/react.svg" },
];

export default function ReviewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-semibold text-slate-900">Student Reviews</h3>
          <p className="mt-2 text-slate-600">Real feedback from students who completed our courses.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleReviews.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
