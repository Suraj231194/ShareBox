import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/slice/auth/authThunk';
import CommonHeader from './CommonHeader';

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
      <div className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden">
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  className="w-full px-5 py-3 rounded-lg bg-muted/50 border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  type="text"
                  name="fullname"
                  onChange={handleChange}
                  value={formData.fullname}
                  placeholder="Full Name"
                  required
                />
              </div>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Login
              </a>
            </p>
          </div>

          {/* Right Side - Image/Pattern */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-primary/10 to-purple-600/10 items-center justify-center relative p-12">
            <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
            <div className="relative z-10 text-center space-y-4">
              <div className="w-64 h-64 bg-contain bg-center bg-no-repeat mx-auto animate-float"
                style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
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
