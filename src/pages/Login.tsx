import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoginImage from "../assets/login-image.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Image Section - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-400 to-red-600 flex-col justify-center items-center text-white p-10 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full"></div>
                    <div className="absolute top-1/3 right-10 w-12 h-12 bg-white rounded-full"></div>
                </div>

                <div className="relative z-10 text-center max-w-md">
                    <h1 className="text-3xl font-bold mb-8 leading-tight">
                        Join the fastest growing publishing platform in the world
                    </h1>

                    {/* Illustration Placeholder */}
                    <div className="flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                            <img
                                src={LoginImage}
                                alt="Publishing Illustration"
                                className="w-30 h-30 sm:w-40 sm:h-50 md:w-56 md:h-56 mb-4 object-contain"
                            />
                            {/* <div className="text-white text-sm opacity-90">📚 Publishing Platform</div> */}
                        </div>
                    </div>


                    <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                        <p className="text-lg italic mb-3 leading-relaxed">
                            "An Excellent and Dedicated Team with an established presence in the publishing industry."
                        </p>
                        <p className="text-sm font-semibold">
                            - Vivek Sreedhar, author of Ketchup & Curry
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Login Form */}
            <div className="flex-1 lg:w-1/2 flex flex-col justify-center p-6 lg:p-10 bg-gray-50 lg:bg-white">
                {/* Mobile Header */}
                <div className="lg:hidden text-center mb-8">
                    <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">📚</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600 text-sm">Sign in to your publishing account</p>
                </div>

                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800 hidden lg:block">Login</h2>

                    <div className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                                />
                                <span className="text-gray-600">Remember Me</span>
                            </label>
                            <button className="text-red-500 hover:text-red-600 transition-colors text-left sm:text-right">
                                Forgot Password?
                            </button>
                        </div>

                        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 lg:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                            Login
                        </button>

                        <p className="text-sm text-center text-gray-600 mt-6">
                            Don't have an account?{" "}
                            <button className="text-red-500 hover:text-red-600 font-semibold transition-colors">
                                Sign up here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="lg:hidden mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Join the fastest growing publishing platform
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
