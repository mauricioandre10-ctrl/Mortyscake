"use client";

import Link from 'next/link';
import { CakeSlice, Menu, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// For this scaffold, we'll assume the user is logged out by default.
const IS_LOGGED_IN = false;

const UserDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src="https://picsum.photos/100" alt="User" data-ai-hint="person face" />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">Pastry Fan</p>
          <p className="text-xs leading-none text-muted-foreground">
            fan@pastry.com
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/account">
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Account</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <CakeSlice className="h-8 w-8 text-primary" />
          <span className="hidden sm:inline-block font-headline text-2xl font-bold">Morty's Cake</span>
        </Link>
        
        <nav className="hidden flex-grow items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="transition-colors hover:text-primary">Courses</Link>
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            {IS_LOGGED_IN ? <UserDropdown /> : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium p-6 mt-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <CakeSlice className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold">Morty's Cake</span>
                </Link>
                <Link href="/" className="text-muted-foreground hover:text-primary">Courses</Link>
                <hr className="border-border" />
                {IS_LOGGED_IN ? (
                  <>
                    <Link href="/account" className="text-muted-foreground hover:text-primary">Account</Link>
                    <Button>Logout</Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
