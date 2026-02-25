import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2, Ticket, User, Mail, Lock, UserCircle, Calendar, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [loading, setLoading] = useState(false);

  // Password strength check
  const checkPasswordStrength = (pass: string) => {
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
    
    const strength = Object.values(checks).filter(Boolean).length;
    
    let strengthText = '';
    let strengthColor = '';
    
    if (pass.length === 0) {
      strengthText = '';
      strengthColor = '';
    } else if (strength <= 2) {
      strengthText = 'Weak';
      strengthColor = 'text-red-600';
    } else if (strength <= 3) {
      strengthText = 'Fair';
      strengthColor = 'text-yellow-600';
    } else if (strength <= 4) {
      strengthText = 'Good';
      strengthColor = 'text-blue-600';
    } else {
      strengthText = 'Strong';
      strengthColor = 'text-[#2e8b57]';
    }
    
    return { checks, strengthText, strengthColor };
  };

  const { checks, strengthText, strengthColor } = checkPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (strengthText === 'Weak' && password.length > 0) {
      toast.error('Please choose a stronger password');
      return;
    }
    
    setLoading(true);

    try {
      await signUp(email, password, name, role);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed up with Google successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="bg-black p-2 rounded-xl border-4 border-black transform group-hover:rotate-12 transition-transform">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-black uppercase">
              Event<span className="text-[#2e8b57] font-light">Hub</span>
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2e8b57] rounded-2xl border-4 border-black mb-4">
            <UserCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
            Create <span className="text-[#2e8b57]">Account</span>
          </h1>
          <p className="text-zinc-600 text-lg font-medium">
            Join EventHub and start your journey
          </p>
          <div className="h-1 w-24 bg-[#2e8b57] mx-auto mt-4"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-[#2e8b57]" /> Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-14 border-4 border-black rounded-2xl text-lg px-6 bg-white focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#2e8b57]" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 border-4 border-black rounded-2xl text-lg px-6 bg-white focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
            />
          </div>

          {/* Password Field with Toggle and Strength Checker */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#2e8b57]" /> Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-14 border-4 border-black rounded-2xl text-lg px-6 bg-white focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm font-black uppercase tracking-wider ${strengthColor}`}>
                    {strengthText}
                  </span>
                  <span className="text-xs font-bold text-zinc-500">
                    {password.length} characters
                  </span>
                </div>
                
                {/* Strength Bar */}
                <div className="w-full h-2 bg-zinc-200 border-2 border-black rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      strengthText === 'Weak' ? 'bg-red-600' :
                      strengthText === 'Fair' ? 'bg-yellow-600' :
                      strengthText === 'Good' ? 'bg-blue-600' :
                      strengthText === 'Strong' ? 'bg-[#2e8b57]' : ''
                    }`}
                    style={{ 
                      width: `${
                        strengthText === 'Weak' ? '25%' :
                        strengthText === 'Fair' ? '50%' :
                        strengthText === 'Good' ? '75%' :
                        strengthText === 'Strong' ? '100%' : '0%'
                      }` 
                    }}
                  />
                </div>

                {/* Password Requirements */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className={`flex items-center gap-1 ${checks.length ? 'text-[#2e8b57]' : 'text-zinc-400'}`}>
                    {checks.length ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${checks.uppercase ? 'text-[#2e8b57]' : 'text-zinc-400'}`}>
                    {checks.uppercase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span>Uppercase</span>
                  </div>
                  <div className={`flex items-center gap-1 ${checks.lowercase ? 'text-[#2e8b57]' : 'text-zinc-400'}`}>
                    {checks.lowercase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span>Lowercase</span>
                  </div>
                  <div className={`flex items-center gap-1 ${checks.number ? 'text-[#2e8b57]' : 'text-zinc-400'}`}>
                    {checks.number ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center gap-1 ${checks.special ? 'text-[#2e8b57]' : 'text-zinc-400'} col-span-2`}>
                    {checks.special ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span>Special character (!@#$%^&*)</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Confirm Password Field with Toggle and Match Checker */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#2e8b57]" /> Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-14 border-4 border-black rounded-2xl text-lg px-6 bg-white focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors pr-14"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && (
              <div className={`flex items-center gap-2 mt-1 text-sm font-bold ${
                passwordsMatch ? 'text-[#2e8b57]' : 'text-red-600'
              }`}>
                {passwordsMatch ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#2e8b57]" /> I want to
            </Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as any)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <RadioGroupItem value="attendee" id="attendee" className="peer sr-only" />
                <Label
                  htmlFor="attendee"
                  className={`flex flex-col items-center justify-center p-4 border-4 border-black rounded-2xl cursor-pointer transition-all ${
                    role === 'attendee' 
                      ? 'bg-[#2e8b57] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white hover:bg-zinc-50'
                  }`}
                >
                  <Ticket className={`h-6 w-6 mb-2 ${role === 'attendee' ? 'text-white' : 'text-[#2e8b57]'}`} />
                  <span className="font-black uppercase text-xs tracking-wider">Attend</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="organizer" id="organizer" className="peer sr-only" />
                <Label
                  htmlFor="organizer"
                  className={`flex flex-col items-center justify-center p-4 border-4 border-black rounded-2xl cursor-pointer transition-all ${
                    role === 'organizer' 
                      ? 'bg-[#2e8b57] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white hover:bg-zinc-50'
                  }`}
                >
                  <Calendar className={`h-6 w-6 mb-2 ${role === 'organizer' ? 'text-white' : 'text-[#2e8b57]'}`} />
                  <span className="font-black uppercase text-xs tracking-wider">Organize</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-[#2e8b57] text-white hover:bg-[#1e5d3a] border-4 border-black rounded-2xl py-8 text-lg font-black uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || (password.length > 0 && !passwordsMatch) || (password.length > 0 && strengthText === 'Weak')}
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-black"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f4f4f4] px-4 font-black tracking-wider text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-4 border-black rounded-2xl py-8 text-lg font-black uppercase tracking-wider bg-white hover:bg-black hover:text-white transition-colors"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm font-bold">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-[#2e8b57] hover:underline underline-offset-4 font-black uppercase tracking-wider"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}