import LoginForm from "./_components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "BaliGuide — Masuk" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">BaliGuide</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akun Anda</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
