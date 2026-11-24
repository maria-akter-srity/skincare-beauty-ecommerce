import React from "react";

const Spinner = () => {
  return (
    <div className="flex h-[60vh] items-center justify-center space-x-2 bg-white">
      <span className="sr-only">Loading...</span>
      <div className="h-4 w-4 animate-bounce rounded-full bg-emerald-700 [animation-delay:-0.3s]" />
      <div className="h-4 w-4 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.15s]" />
      <div className="h-4 w-4 animate-bounce rounded-full bg-emerald-500" />
    </div>
  );
};

export default Spinner;
