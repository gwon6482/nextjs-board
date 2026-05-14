"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Home, PenSquare, BookOpen, LogIn, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/posts/new", label: "글쓰기", icon: PenSquare, authRequired: true },
    { href: "/my-posts", label: "내글", icon: BookOpen, authRequired: true },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* PC 상단 헤더 */}
      <header className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-red-600">
            게시판
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map(({ href, label, authRequired }) => {
              if (authRequired && !session) return null;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "text-red-600"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <LogOut size={14} />
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <LogIn size={14} />
                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* 모바일 상단 타이틀 */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="h-12 flex items-center justify-center">
          <Link href="/" className="text-lg font-bold text-red-600">
            게시판
          </Link>
        </div>
      </header>

      {/* 모바일 하단 탭 네비게이션 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex">
          <Link
            href="/"
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs ${
              isActive("/") ? "text-red-600" : "text-gray-500"
            }`}
          >
            <Home size={20} />
            홈
          </Link>

          {session ? (
            <>
              <Link
                href="/posts/new"
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs ${
                  isActive("/posts/new") ? "text-red-600" : "text-gray-500"
                }`}
              >
                <PenSquare size={20} />
                글쓰기
              </Link>
              <Link
                href="/my-posts"
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs ${
                  isActive("/my-posts") ? "text-red-600" : "text-gray-500"
                }`}
              >
                <BookOpen size={20} />
                내글
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs text-gray-500"
              >
                <LogOut size={20} />
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs ${
                isActive("/login") ? "text-red-600" : "text-gray-500"
              }`}
            >
              <LogIn size={20} />
              로그인
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
