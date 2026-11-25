
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import SiteFrame from "../../components/SiteFrame";

const API_URL = "http://localhost:3000";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // VALIDATION
    if (isRegister && !name) {
      toast.error("Please enter your name.");
      return;
    }

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    if (isRegister && password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (isRegister && !confirmPassword) {
      toast.error("Please confirm your password.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // REGISTER CUSTOMER
      if (isRegister) {
        const usersResponse = await fetch(`${API_URL}/users`);

        if (!usersResponse.ok) {
          throw new Error("Unable to check existing accounts.");
        }

        const users = await usersResponse.json();

        const existingUser = users.find(
          (user) => user.email?.toLowerCase() === email
        );

        if (existingUser) {
          toast.error("This email is already registered.");
          return;
        }

        const response = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "customer",
            isBlocked: false,
          }),
        });

        if (!response.ok) {
          throw new Error("Registration failed. Please try again.");
        }

        const newUser = await response.json();

        dispatch(
          login({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: "customer",
          })
        );

        toast.success("Your VÉLUNE account has been created!");

        resetForm();
        navigate("/", { replace: true });
      }

      // LOGIN CUSTOMER OR ADMIN
      else {
        const response = await fetch(`${API_URL}/users`);

        if (!response.ok) {
          throw new Error("Unable to connect to the server.");
        }

        const users = await response.json();

        const foundUser = users.find(
          (item) =>
            item.email?.toLowerCase() === email &&
            item.password === password
        );

        if (!foundUser) {
          toast.error("Invalid email or password.");
          return;
        }

        if (foundUser.isBlocked) {
          toast.error("Your account has been blocked.");
          return;
        }

        // Existing users without a role are treated as customers.
        const userRole = foundUser.role || "customer";

        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: userRole,
        };

        dispatch(login(userData));

        toast.success(`Welcome back, ${foundUser.name}!`);

        resetForm();

        // REDIRECT BASED ON ROLE
        if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          const redirectPath =
            location.state?.from?.pathname || "/";

          navigate(redirectPath, { replace: true });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);

      toast.error(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister((prev) => !prev);
    resetForm();
  };

  return (
    <SiteFrame>
      <section className="flex min-h-[80vh] items-center justify-center bg-[#491225] px-5 py-16">
        <div className="w-full max-w-md bg-[#F5E8D5] px-7 py-10 shadow-xl md:px-12 md:py-14">

          {/* HEADING */}
          <div className="mb-9 text-center">
            <Link
              to="/"
              className="font-['Playfair_Display'] text-3xl tracking-wide text-[#491225]"
            >
              VÉLUNE
            </Link>

            <h1 className="mt-7 font-serif text-3xl text-[#491225]">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>

            <p className="mt-3 text-sm text-[#806E6D]">
              {isRegister
                ? "Create your account and discover timeless elegance."
                : "Sign in to continue your VÉLUNE journey."}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs uppercase tracking-[1.5px] text-[#491225]"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="w-full border border-[#491225]/20 bg-transparent px-4 py-3 text-sm text-[#491225] outline-none transition placeholder:text-[#806E6D] focus:border-[#491225]"
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-[1.5px] text-[#491225]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full border border-[#491225]/20 bg-transparent px-4 py-3 text-sm text-[#491225] outline-none transition placeholder:text-[#806E6D] focus:border-[#491225]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs uppercase tracking-[1.5px] text-[#491225]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  required
                  className="w-full border border-[#491225]/20 bg-transparent px-4 py-3 pr-12 text-sm text-[#491225] outline-none transition placeholder:text-[#806E6D] focus:border-[#491225]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#491225]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs uppercase tracking-[1.5px] text-[#491225]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="w-full border border-[#491225]/20 bg-transparent px-4 py-3 pr-12 text-sm text-[#491225] outline-none transition placeholder:text-[#806E6D] focus:border-[#491225]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#491225]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#491225] px-5 py-4 text-xs font-medium uppercase tracking-[2px] text-[#F5E8D5] transition hover:bg-[#350B19] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please Wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          {/* SWITCH LOGIN / REGISTER */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#806E6D]">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>

            <button
              type="button"
              onClick={switchMode}
              className="mt-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#491225] underline underline-offset-4 transition hover:opacity-60"
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </div>

        </div>
      </section>
    </SiteFrame>
  );
}
