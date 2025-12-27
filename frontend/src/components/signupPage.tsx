export default function SignUp({ isVisible }) {
  if (!isVisible) return null; // hide when false
  return (
    <div>
      <form action="">
        <label htmlFor="">Email</label>
        <input type="text" />
        <label htmlFor="">Password</label>
        <input type="text" />
        <div>
          <button>Sign Up</button>
          <button>Sign In</button>
        </div>
      </form>
    </div>
  );
}
