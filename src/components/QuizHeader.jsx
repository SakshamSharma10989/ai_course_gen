export default function QuizHeader({ topic, current, total }) {
  return (
    <div className="flex justify-between items-center mb-6 px-6 py-4 bg-teal-50 border border-teal-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-black capitalize tracking-wide">

         <span className="capitalize text-black">
    {decodeURIComponent(topic)}
  </span> Quiz
      </h2>
      <p className="text-sm text-black font-medium">
        Question {current} of {total}
      </p>
    </div>
  );
}
