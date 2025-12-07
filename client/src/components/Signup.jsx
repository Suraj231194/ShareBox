import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/slice/auth/authThunk';
import CommonHeader from './CommonHeader';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.fullname || !formData.password) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      const result = await dispatch(registerUser(formData));
      if (result.error) {
        console.log(result);
        toast.error(result.payload);
      } else {
        toast.success('Registration successful');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Error During Registration');
      console.log(error);
    }
  }
  return (
    <>
      <CommonHeader />
      <div className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden pt-20">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-4xl bg-card border border-border shadow-xl rounded-2xl overflow-hidden flex z-10 mx-4">

          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-2">
                Join Paste Box
              </h1>
              <p className="text-muted-foreground text-center">
                Create an account to start sharing securely.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="fullname">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    className="w-full pl-10 pr-5 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    type="text"
                    id="fullname"
                    name="fullname"
                    onChange={handleChange}
                    value={formData.fullname}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    className="w-full pl-10 pr-5 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    className="w-full pl-10 pr-5 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-bold text-white bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <UserPlus className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* Right Side - Image/Pattern */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-primary/10 to-purple-600/10 items-center justify-center relative p-12">
            <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
            <div className="relative z-10 text-center space-y-4 flex flex-col items-center">
              <div className="p-6 bg-white rounded-full shadow-2xl mb-4 animate-float">
                <UserPlus className="w-24 h-24 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Join Our Community</h2>
              <p className="text-muted-foreground">Share seamlessly with PasteBox.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Signup;
