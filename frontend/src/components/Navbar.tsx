import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "PREDICTOR", path: "/" },
    { name: "RANKINGS", path: "/rankings" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-14">
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-4 text-sm font-bold tracking-wider transition-colors ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};