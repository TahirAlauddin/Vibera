import Image from "next/image";

export default function SignUpModal({ onClose, onSwitch }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center   ">
      <button onClick={onClose}>
        <Image
          src="/assets/cancel.png"
          alt="close button"
          width={20}
          height={20}
        />
      </button>
      <div className="bg-white flex justify-center flex-col ">
        <h2 className="text-center">Sign Up</h2>
        <form action="" className="flex justify-center flex-col items-center">
          <label htmlFor="">Email</label>
          <input type="text" placeholder="Email" />
          <label htmlFor="">Password</label>
          <input type="password" placeholder="password" />
          <div>
            <button>Sign Up</button>
            <button onClick={onSwitch}>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}
