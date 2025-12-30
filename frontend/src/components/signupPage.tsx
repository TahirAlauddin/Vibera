import Image from "next/image";

export default function SignUpModal({ onClose, onSwitch }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center  z-50 ">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-10 right-2 p-2 rounded-full shadow-md hover:scale-105 transition"
        >
          <Image
            src="/assets/cancel.png"
            alt="close button"
            width={20}
            height={20}
          />
        </button>
        {/* modal */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6">
            Sign Up
          </h2>
          <form action="" className="flex  flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="">Email</label>
              <input
                type="text"
                placeholder="email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Password</label>
              <input
                type="password"
                placeholder="password"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              <button className="mt-2 color-primary text-white w-full sm:w-[200px] py-2 rounded-full font-medium hover:opacity-90 transition">
                Sign Up
              </button>
              <button
                onClick={onSwitch}
                className="mt-2 bg-white text-accent border border-accent  py-2 w-full sm:w-[200px] rounded-full font-medium hover:opacity-80 transition"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
