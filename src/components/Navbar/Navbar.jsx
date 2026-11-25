
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import toast from "react-hot-toast";
import Logo from "./Logo";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // CHECK USER ROLE
  const isAdmin = user?.role === "admin";

  // CHECK AUTH PAGE
  const isAuthPage = location.pathname === "/login";

  // CART COUNT
  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // WISHLIST COUNT
  const wishlistCount = wishlistItems.length;

  // NAVIGATION LINKS
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // CLOSE MENUS WHEN ROUTE CHANGES
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // CHECK HERO VISIBILITY
  useEffect(() => {
    const checkHero = () => {
      const hero = document.getElementById("home-hero");
      const header = document.getElementById("site-navbar");

      if (location.pathname !== "/" || !hero) {
        setIsHeroVisible(false);
        return;
      }

      const headerHeight = header?.offsetHeight || 0;
      const heroBottom = hero.getBoundingClientRect().bottom;

      setIsHeroVisible(heroBottom > headerHeight);
    };

    checkHero();

    window.addEventListener("scroll", checkHero);
    window.addEventListener("resize", checkHero);

    return () => {
      window.removeEventListener("scroll", checkHero);
      window.removeEventListener("resize", checkHero);
    };
  }, [location.pathname]);

  // NAVBAR BACKGROUND
  const navbarColor =
    isHeroVisible && location.pathname === "/"
      ? "bg-black"
      : "bg-[#491225]";

  // LOGOUT
  const handleLogout = () => {
    dispatch(logout());

    setProfileOpen(false);
    setMenuOpen(false);

    toast.success("You have been logged out successfully!");

    navigate("/", { replace: true });
  };

  // NAVBAR ICONS
  const icons = [
    {
      name: "Profile",
      path: isLoggedIn ? null : "/login",
      count: 0,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21c0-4 3-6 7-6s7 2 7 6" />
        </svg>
      ),
    },
    {
      name: "Wishlist",
      path: "/wishlist",
      count: wishlistCount,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path d="M20.8 8.7c0 5.4-8.8 11-8.8 11S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
        </svg>
      ),
    },
    {
      name: "Cart",
      path: "/cart",
      count: cartCount,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path d="M5 8h14l1 12H4L5 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
      ),
    },
  ];

  // ADMINS USE THEIR OWN DASHBOARD NAVIGATION
  if (isAdmin) {
    return null;
  }

  return (
    <header id="site-navbar" className="sticky top-0 z-50 w-full">

      {isAuthPage ? (
        // LOGIN / REGISTER NAVBAR - ONLY LOGO
        <div className="flex h-[85px] w-full items-center justify-center bg-[#491225]">
          <Link to="/" aria-label="VÉLUNE Home">
            <Logo />
          </Link>
        </div>
      ) : (
        <>
          {/* MAIN NAVBAR */}
          <div
            className={`relative flex h-[85px] items-center justify-between px-5 transition-colors duration-500 md:px-10 ${navbarColor}`}
          >
            <div className="w-20" />

            {/* CENTER LOGO */}
            <Logo />

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-3 text-[#F5E8D5] md:gap-6">

              {/* PROFILE ICON */}
              <div className="relative">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    title="My Account"
                    aria-label="My Account"
                    aria-expanded={profileOpen}
                    className="transition hover:text-[#A66B7D]"
                  >
                    {icons[0].icon}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    title="Login"
                    aria-label="Login"
                    className="transition hover:text-[#A66B7D]"
                  >
                    {icons[0].icon}
                  </Link>
                )}

                {/* ACCOUNT MENU */}
                {profileOpen && isLoggedIn && (
                  <div className="absolute right-0 top-10 z-[60] w-56 border border-[#F5E8D5]/20 bg-[#491225] p-5 text-[#F5E8D5] shadow-xl">

                    <p className="text-[10px] uppercase tracking-[2px] text-[#D8C3C7]">
                      Signed In
                    </p>

                    <p className="mt-2 truncate font-serif text-lg">
                      {user?.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#D8C3C7]">
                      {user?.email}
                    </p>

                    <div className="mt-5 border-t border-[#F5E8D5]/20 pt-4">

                      <Link
                        to="/cart"
                        onClick={() => setProfileOpen(false)}
                        className="block text-xs uppercase tracking-wider transition hover:opacity-60"
                      >
                        My Shopping Bag
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setProfileOpen(false)}
                        className="mt-4 block text-xs uppercase tracking-wider transition hover:opacity-60"
                      >
                        My Wishlist
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="mt-4 block text-xs uppercase tracking-wider transition hover:opacity-60"
                      >
                        My Orders
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-5 w-full border border-[#F5E8D5] px-4 py-3 text-xs uppercase tracking-widest transition hover:bg-[#F5E8D5] hover:text-[#491225]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* WISHLIST AND CART */}
              {icons.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  title={item.name}
                  aria-label={`${item.name} with ${item.count} items`}
                  className="relative transition hover:text-[#A66B7D]"
                >
                  {item.icon}

                  {item.count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#F5E8D5] px-1 text-[10px] font-medium text-[#491225]">
                      {item.count > 99 ? "99+" : item.count}
                    </span>
                  )}
                </Link>
              ))}

              {/* MOBILE MENU BUTTON */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="ml-1 text-xl text-[#F5E8D5] md:hidden"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav
            className={`hidden h-[50px] items-center justify-center gap-10 text-[#F5E8D5] transition-colors duration-500 md:flex ${navbarColor}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-['Syne'] text-[11px] font-medium uppercase tracking-[1.8px] transition hover:text-[#A66B7D]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* MOBILE NAVIGATION */}
          <div
            className={`overflow-hidden bg-[#FEF7F2] transition-all duration-300 md:hidden ${
              menuOpen ? "max-h-72 py-6" : "max-h-0"
            }`}
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="font-['Syne'] text-xs uppercase tracking-[2px] text-[#491225] transition hover:text-[#A66B7D]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
