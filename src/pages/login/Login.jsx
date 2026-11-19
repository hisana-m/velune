
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import SiteFrame from "../../components/SiteFrame";

const API_URL = "http://localhost:3000";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error("Unable to connect to the server.");
      }

      const users = await response.json();

      if (isRegister) {
        const existingUser = users.find(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
          setError("An account with this email already exists.");
          setLoading(false);
          return;
        }

        const registerResponse = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        if (!registerResponse.ok) {
          throw new Error("Registration failed. Please try again.");
        }

        const newUser = await registerResponse.json();

        dispatch(
          login({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          })
        );

        navigate(redirectTo, { replace: true });
      } else {
        const user = users.find(
          (item) =>
            item.email.toLowerCase() === email.toLowerCase() &&
            item.password === password
        );

        if (!user) {
          setError("Invalid email or password.");
          setLoading(false);
          return;
        }

        dispatch(
          login({
            id: user.id,
            name: user.name,
            email: user.email,
          })
        );

        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-[#491225]">
      <SiteFrame>
        <section className="min-h-[75vh] bg-[#F5E8D5] px-5 py-16 text-[#491225] md:px-10 md:py-24">
          <div className="mx-auto max-w-md">

            <div className="mb-10 text-center">
              <p className="text-[10px] uppercase tracking-[4px] text-[#806E6D]">
                Welcome to VÉLUNE
              </p>

              <h1 className="mt-4 font-serif text-4xl md:text-5xl">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#72515A]">
                {isRegister
                  ? "Create your account and discover timeless elegance."
                  : "Sign in to access your wishlist and shopping bag."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {isRegister && (
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full border border-[#491225]/40 bg-transparent px-4 py-4 text-sm outline-none transition focus:border-[#491225]"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-[#491225]/40 bg-transparent px-4 py-4 text-sm outline-none transition focus:border-[#491225]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter password"
                    className="w-full border border-[#491225]/40 bg-transparent px-4 py-4 pr-12 text-sm outline-none transition focus:border-[#491225]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#491225]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="border border-red-800/30 bg-red-900/5 px-4 py-3 text-sm text-red-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 bg-[#491225] px-6 py-4 text-xs uppercase tracking-[2px] text-[#F5E8D5] transition hover:bg-[#350B19] disabled:opacity-60"
              >
                {loading
                  ? "Please Wait..."
                  : isRegister
                  ? "Create Account"
                  : "Login"}

                {!loading && <ArrowRight size={16} />}
              </button>

            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#72515A]">
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="mt-2 text-xs uppercase tracking-widest underline underline-offset-4 transition hover:opacity-60"
              >
                {isRegister ? "Login Here" : "Create an Account"}
              </button>
            </div>

            <Link
              to="/collections"
              className="mt-8 block text-center text-xs tracking-wider text-[#72515A] transition hover:text-[#491225]"
            >
              Continue Shopping
            </Link>

          </div>
        </section>
      </SiteFrame>
    </main>
  );
}
