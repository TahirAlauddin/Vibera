import Image from "next/image";
export default function LoginModal({ onClose, onSwitch }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <button onClick={onClose}>
        <Image
          src="/assets/cancel.png"
          alt="close button"
          width={20}
          height={20}
        />
      </button>
      <div className="bg-white flex justify-center flex-col">
        <h2 className="text-center">Sign in</h2>
        <form action="" className="flex justify-center flex-col items-center">
          <label htmlFor="">Email</label>
          <input type="text" placeholder="email" />
          <label htmlFor="">Password</label>
          <input type="text" placeholder="password" />
          <div>
            <button>Sign In</button>
            <button onClick={onSwitch}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
