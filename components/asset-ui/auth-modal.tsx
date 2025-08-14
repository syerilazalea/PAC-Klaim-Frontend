// components/auth-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  X,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  BadgeIcon as IdCard
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "register") => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nik: string;
  phone: string;
  role: "employee" | "hr" | "finance" | "";
}

const ROLES = [
  {
    id: "employee",
    name: "Employee",
    description: "Karyawan yang mengajukan klaim",
    redirectTo: "/employee/dashboard"
  },
  {
    id: "hr",
    name: "HR",
    description: "Human Resources untuk review klaim",
    redirectTo: "/hr/dashboard"
  },
  {
    id: "finance",
    name: "Finance",
    description: "Tim Finance untuk proses pembayaran",
    redirectTo: "/finance/dashboard"
  }
] as const;

type RoleId = typeof ROLES[number]["id"];

const getRedirectByRole = (role?: string) => {
  switch (role) {
    case "employee":
      return "/employee/dashboard";
    case "hr":
      return "/hr/dashboard";
    case "finance":
      return "/finance/dashboard";
    default:
      return "/dashboard";
  }
};

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode
}: AuthModalProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nik: "",
    phone: "",
    role: ""
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!baseURL) {
      setError("NEXT_PUBLIC_API_BASE_URL belum diset.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Password tidak cocok");
        }
        if (!formData.role) {
          throw new Error("Silakan pilih role");
        }
        if (!/^\d{16}$/.test(formData.nik)) {
          throw new Error("NIK harus 16 digit");
        }

        const regRes = await fetch(`${baseURL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            nik: formData.nik,
            phone: formData.phone,
            role: formData.role as RoleId
          })
        });

        if (!regRes.ok) {
          const err = await regRes.json().catch(() => null);
          throw new Error(err?.message || "Registrasi gagal");
        }

        const loginRes = await fetch(`${baseURL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        if (!loginRes.ok) {
          const err = await loginRes.json().catch(() => null);
          throw new Error(err?.message || "Login otomatis gagal");
        }
        const data = await loginRes.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.user.role);
        onClose();
        localStorage.setItem("userId", data.user.id); // <-- TAMBAHKAN INI
        router.push(getRedirectByRole(data?.user?.role));
        return;
      }

      const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Login gagal");
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.user.role);
      onClose();
      localStorage.setItem("userId", data.user.id);
      router.push(getRedirectByRole(data?.user?.role));
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (mode === "login") {
      return Boolean(formData.email && formData.password);
    }
    return Boolean(
      formData.name &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.nik &&
        formData.phone &&
        formData.role &&
        formData.password === formData.confirmPassword
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-semibold">
              {mode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "login"
                ? "Masuk ke sistem KlaimKu"
                : "Daftar untuk menggunakan KlaimKu"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <>
              {/* Email */}
              <div>
                <Label>Email *</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    placeholder="Masukkan email"
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Password */}
              <div>
                <Label>Password *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Masukkan password"
                    className="pl-10 pr-10 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Nama */}
              <div>
                <Label>Nama Lengkap *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* NIK */}
              <div>
                <Label>NIK *</Label>
                <div className="relative mt-1">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    inputMode="numeric"
                    value={formData.nik}
                    onChange={(e) => handleInputChange("nik", e.target.value)}
                    placeholder="16 digit NIK"
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Phone */}
              <div>
                <Label>Nomor Telepon *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    placeholder="0812xxxx atau +62812xxxx"
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Email */}
              <div>
                <Label>Email *</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    placeholder="Masukkan email"
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Role */}
              <div>
                <Label>Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    handleInputChange("role", value as RoleId)
                  }
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.name}</span>
                          <span className="text-xs text-gray-500">
                            {role.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Password */}
              <div>
                <Label>Password *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Masukkan password"
                    className="pl-10 pr-10 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div>
                <Label>Konfirmasi Password *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Konfirmasi password"
                    className="pl-10 pr-10 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      Password tidak cocok
                    </p>
                  )}
              </div>
            </>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isLoading
              ? mode === "login"
                ? "Sedang Masuk..."
                : "Membuat Akun..."
              : mode === "login"
              ? "Masuk"
              : "Buat Akun"}
          </Button>

          {/* Switch mode */}
          <div className="text-center text-sm text-gray-500 mt-3">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => onSwitchMode("register")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Daftar di sini
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => onSwitchMode("login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Masuk di sini
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
