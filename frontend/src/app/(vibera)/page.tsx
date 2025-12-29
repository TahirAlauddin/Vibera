export default function Home() {
  return (
    <div className="px-4 h-[80vh] ">
      <div className="flex justify-center flex-col items-center h-full">
        <h1 className="text-center p-4 font-bold text-4xl sm:text-5xl color-accent ">
          Track Your Mood, Share Story
        </h1>
        <p className="p-4 text-center">
          A daily mood journal for mindful reflection & community connection
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
          <button className=" bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-primary/80 ">
            Get Started - its Free
          </button>
          <button className="bg-white text-accent border border-primary font-bold px-6 py-2 rounded-full hover:bg-white/80">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
