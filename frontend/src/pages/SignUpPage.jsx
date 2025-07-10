import React from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import {
  MessageSquare,
  User,
  Mail,
  Lock,
  EyeOff,
  Eye,
  Loader2,
} from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { signup, isSigningUp } = useAuthStore();
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });
  const validateForm = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      return toast.error("Please fill in all fields.");
    }
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Please enter a valid email address.");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters long.");
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name (will be visible to all users)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Van Damme"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                ></input>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40" />
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  placeholder="example@gmail.com"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/60" />
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="•••••••••••"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/60" />
                  ) : (
                    <Eye className="size-5 text-base-content/60" />
                  )}
                </button>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/60" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side */}

      <AuthImagePattern
        title="Turn Every Yap Into a Meaningful Chat"
        subtitle="Sign up to connect with others and share your thoughts."
      />
    </div>
  );
};

export default SignUpPage;
