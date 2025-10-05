import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // `useState` ko ab `light` aur `dark` modes ke liye hi manage karenge.
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  // `useEffect` ab sirf `theme` state par depend karega.
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    // Button click par theme ko toggle karenge.
    setTheme(currentTheme => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    // Ek hi button jo icon ko conditionally render karega.
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleThemeToggle}
      className="btn-floating"
    >
      {/* Agar theme light hai to Sun icon dikhega, warna Moon icon */}
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}