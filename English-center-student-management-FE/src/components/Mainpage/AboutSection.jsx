import React from "react";

export default function AboutSection({ title = "About English Center", intro, highlights = [], approachTitle = "Our Approach", approachText }) {
  const defaultIntro = "We provide structured English courses with experienced teachers, practical lessons and a friendly learning environment.";
  const defaultApproach = "We combine communicative teaching with practical tasks, continuous assessment and progress reports so students can see improvement every week.";

  return (
    <section id="about" className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{title}</h2>
            <p className="mt-4 text-lg text-slate-600">{intro || defaultIntro}</p>

            {highlights && highlights.length > 0 ? (
              <ul className="mt-6 space-y-2 text-slate-700">
                {highlights.map((h, i) => (
                  <li key={i}>• {h}</li>
                ))}
              </ul>
            ) : (
              <ul className="mt-6 space-y-2 text-slate-700">
                <li>• Curriculum designed for measurable progress</li>
                <li>• Small classes and personalised feedback</li>
                <li>• Flexible schedules (online & offline)</li>
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">{approachTitle}</h3>
            <p className="mt-3 text-slate-600">{approachText || defaultApproach}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#contact" className="inline-block rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Contact us</a>
              <a href="#courses" className="inline-block rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">View courses</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
