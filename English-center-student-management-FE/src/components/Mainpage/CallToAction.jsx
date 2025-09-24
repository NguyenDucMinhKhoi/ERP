import React from "react";

export default function CallToAction() {
  return (
    <section id="contact" className="bg-indigo-600 py-12 text-white">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <h4 className="text-2xl font-bold">Ready to get started?</h4>
        <p className="mt-2 max-w-2xl">Contact us for personalized learning advice and the latest promotions.</p>
        <div className="mt-6 flex gap-3">
          <a href="#enroll" className="rounded bg-white px-4 py-2 text-indigo-600 font-medium">Enroll Now</a>
          <a href="#learn-more" className="rounded border border-white px-4 py-2">Learn More</a>
        </div>
      </div>
    </section>
  );
}
