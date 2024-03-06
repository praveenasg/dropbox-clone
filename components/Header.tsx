import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import dropBoxLogo from "@/public/dropBox-Logo.png";
import { Button } from "./ui/button";
import { ThemeToggler } from "./ThemeToggler";

function Header() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Image
          src={dropBoxLogo}
          alt="DropBox Logo"
          className=""
          height={50}
          width={50}
        />
        <h1 className="font-bold text-xl">DropBox</h1>
      </Link>
      <div className="px-5 flex space-x-2 items-center">
        {/* theme toggler */}
        <ThemeToggler />

        {/* user button */}
        <UserButton afterSignOutUrl="/" />

        <SignedOut>
          <Button variant="outline">
            <SignInButton afterSignInUrl="/dashboard" mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
