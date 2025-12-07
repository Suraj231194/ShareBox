import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../redux/slice/auth/authThunk';
import { setCredentials } from '../redux/slice/auth/authSlice';
import CommonHeader from './CommonHeader';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDemoLogin = () => {
    const demoUser = {
      fullname: "Demo User",
      email: "demo@sharebox.com",
      _id: "demo_id_123"
    };
    dispatch(setCredentials(demoUser));
    toast.success("Logged in as Demo User");
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      const result = await dispatch(loginUser(formData));
      if (result.error) {
        toast.error(result.payload || "Login failed");
      } else {
        toast.success('Login successful');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Error During Login');
      console.log(error);
    }
  };

  return (
    <>
      <CommonHeader />
      <div className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-4xl bg-card border border-border shadow-xl rounded-2xl overflow-hidden flex z-10 mx-4">

          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-center">
                Enter your credentials to access your files.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  className="w-full px-5 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-5 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-bold text-white bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mt-4 py-4 rounded-lg font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all border border-primary/20 flex items-center justify-center gap-2"
            >
              Demo Login (Skip Auth)
            </button>

            <p className="mt-8 text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <a href="/signup" className="text-primary font-semibold hover:underline">
                Sign Up
              </a>
            </p>
          </div>

          {/* Right Side - Image/Pattern */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 to-purple-600/10 items-center justify-center relative p-12">
            <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
            <div className="relative z-10 text-center space-y-4">
              <div className="w-64 h-64 bg-contain bg-center bg-no-repeat mx-auto animate-float"
                style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Secure & Fast File Sharing</h2>
              <p className="text-muted-foreground">Access your documents from anywhere.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
