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
      <div className="bg-white">
        <h2>Sign in</h2>
        <form action="">
          <label htmlFor="">Username</label>
          <input type="text" />
          <label htmlFor="">Password</label>
          <input type="text" />
          <div>
            <button>Sign In</button>
            <button>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
