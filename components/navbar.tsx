"use client";

import {Menu, Moon, Sun, X} from "lucide-react";
import {useTheme} from "next-themes";
import * as React from "react";
import {Button} from "~/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "~/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {theme, setTheme} = useTheme();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    {name: "Home", href: "#home"},
    {name: "About", href: "#about"},
    {name: "Projects", href: "#projects"},
    {name: "Experience", href: "#experience"},
    {name: "Contact", href: "#contact"},
  ];
  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 px-4 transition-all duration-300 sm:px-0 ${
        isScrolled ? "bg-background/90 py-2 shadow-sm backdrop-blur-sm" : "py-4"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <a href="#home" className="font-bold text-2xl text-foreground">
          Muhbi<span className="text-primary">.</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="relative py-2 text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:text-primary hover:after:w-full"
              >
                {link.name}
              </a>
            </li>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0"/>
                <Moon
                  className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {theme === "light" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("dark")}
            >
              <Moon size={20}/>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("light")}
            >
              <Sun size={20}/>
            </Button>
          )}

          <button
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          className="absolute top-full right-0 left-0 animate-fade-in bg-background/95 shadow-md backdrop-blur-sm md:hidden">
          <ul className="container-custom flex flex-col py-4">
            {navLinks.map((link) => (
              <li key={link.name} className="py-2">
                <a
                  href={link.href}
                  className="block w-full text-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
