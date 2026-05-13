export default function QuizHeader({ topic, current, total }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6 px-4 sm:px-6 py-4 bg-teal-50 border border-teal-200 rounded-lg shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-black capitalize tracking-wide">

         <span className="capitalize text-black break-words">
            {decodeURIComponent(topic)}
          </span> Quiz
      </h2>
      <p className="text-sm text-black font-medium shrink-0">
        Question {current} of {total}
      </p>
    </div>
  );
}
