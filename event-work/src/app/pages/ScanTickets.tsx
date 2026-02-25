import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrganizerSidebar from '../components/OrganizerSidebar';
import MobileSidebar from '../components/MobileSidebar';
import { Menu } from 'lucide-react';
import { checkInTicket } from '../../services/ticketService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle2, XCircle, Camera, Loader2, Scan, QrCode, Ticket } from 'lucide-react';
import { toast } from 'sonner';

export default function ScanTickets() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [manualTicketId, setManualTicketId] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef('qr-reader-' + Math.random().toString(36).substr(2, 9));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user || userProfile?.role !== 'organizer') {
      navigate('/');
      return;
    }

    return () => {
      stopScanning();
    };
  }, [user, userProfile]);

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode(readerIdRef.current);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setScanning(true);
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast.error('Failed to start camera. Please check permissions.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);
    await stopScanning();
    await validateTicket(decodedText);
  };

  const onScanError = (errorMessage: string) => {
    // Ignore scan errors (they happen frequently during scanning)
  };

  const validateTicket = async (ticketId: string) => {
    setProcessing(true);
    setValidationResult(null);

    try {
      const result = await checkInTicket(ticketId);
      setValidationResult(result);

      if (result.valid) {
        toast.success('Ticket validated successfully!');
      } else {
        toast.error(result.error || 'Invalid ticket');
      }
    } catch (error: any) {
      console.error('Error validating ticket:', error);
      setValidationResult({
        valid: false,
        error: error.message || 'Failed to validate ticket',
      });
      toast.error('Failed to validate ticket');
    } finally {
      setProcessing(false);
    }
  };

  const handleManualValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualTicketId.trim()) {
      validateTicket(manualTicketId.trim());
    }
  };

  const resetScanner = () => {
    setValidationResult(null);
    setManualTicketId('');
  };

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <OrganizerSidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <main className="flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-black p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">Scan Tickets</h2>
            <button 
              onClick={() => setMobileOpen(true)} 
              className="p-2 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#2e8b57] p-2 rounded-xl border-4 border-black">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                  Scan <span className="text-[#2e8b57]">Tickets</span>
                </h1>
              </div>
              <div className="h-2 w-24 bg-[#2e8b57] mb-4"></div>
              <p className="text-zinc-600 text-lg font-medium">
                Validate tickets by scanning QR codes or manual entry
              </p>
            </div>

            <div className="space-y-8">
              {/* QR Scanner Card */}
              <div className="bg-white border-4 border-black rounded-[3rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
                <div className="p-6 border-b-4 border-black bg-zinc-50">
                  <div className="flex items-center gap-3">
                    <Camera className="h-6 w-6 text-[#2e8b57]" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      QR Code Scanner
                    </h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    {/* Scanner Container */}
                    <div
                      id={readerIdRef.current}
                      className={`rounded-2xl border-4 border-black overflow-hidden ${scanning ? '' : 'hidden'}`}
                    />

                    {/* Start Scanner UI */}
                    {!scanning && !validationResult && (
                      <div className="text-center py-12">
                        <div className="w-32 h-32 bg-zinc-100 rounded-2xl border-4 border-black flex items-center justify-center mx-auto mb-6">
                          <Scan className="h-16 w-16 text-[#2e8b57]" />
                        </div>
                        <p className="text-xl font-black uppercase tracking-tight mb-2">
                          Ready to Scan?
                        </p>
                        <p className="text-zinc-600 font-medium mb-8">
                          Start the camera to scan ticket QR codes
                        </p>
                        <Button 
                          onClick={startScanning}
                          className="bg-[#2e8b57] text-white hover:bg-[#1e5d3a] border-4 border-black rounded-2xl py-8 px-12 text-lg font-black uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Start Camera
                        </Button>
                      </div>
                    )}

                    {/* Stop Scanning Button */}
                    {scanning && (
                      <div className="text-center">
                        <Button 
                          variant="outline" 
                          onClick={stopScanning}
                          className="border-4 border-black rounded-2xl py-6 px-8 text-lg font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                        >
                          Stop Camera
                        </Button>
                      </div>
                    )}

                    {/* Processing State */}
                    {processing && (
                      <div className="text-center py-8">
                        <div className="bg-zinc-100 border-4 border-black rounded-2xl p-8">
                          <Loader2 className="h-16 w-16 animate-spin text-[#2e8b57] mx-auto mb-4" />
                          <p className="text-xl font-black uppercase tracking-tight">
                            Validating Ticket...
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Validation Result */}
                    {validationResult && (
                      <div className={`border-4 border-black rounded-2xl p-6 ${
                        validationResult.valid 
                          ? 'bg-green-50 border-green-600' 
                          : 'bg-red-50 border-red-600'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl border-4 border-black ${
                            validationResult.valid 
                              ? 'bg-green-600' 
                              : 'bg-red-600'
                          }`}>
                            {validationResult.valid ? (
                              <CheckCircle2 className="h-8 w-8 text-white" />
                            ) : (
                              <XCircle className="h-8 w-8 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className={`text-2xl font-black uppercase tracking-tight mb-2 ${
                              validationResult.valid ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {validationResult.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                            </p>
                            
                            {validationResult.ticket && (
                              <div className="space-y-2 mb-4">
                                <div className="bg-white border-4 border-black rounded-xl p-3">
                                  <p className="text-sm font-black uppercase tracking-wider text-zinc-500 mb-1">
                                    Event
                                  </p>
                                  <p className="font-bold">{validationResult.ticket.event?.title}</p>
                                </div>
                                <div className="bg-white border-4 border-black rounded-xl p-3">
                                  <p className="text-sm font-black uppercase tracking-wider text-zinc-500 mb-1">
                                    Ticket ID
                                  </p>
                                  <p className="font-mono font-bold text-sm break-all">
                                    {validationResult.ticket.id}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {validationResult.error && (
                              <p className="font-bold text-red-600 mb-4">
                                {validationResult.error}
                              </p>
                            )}

                            <Button
                              variant="outline"
                              onClick={resetScanner}
                              className="border-4 border-black rounded-2xl py-6 px-8 text-sm font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                            >
                              Scan Another Ticket
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Manual Entry Card */}
              <div className="bg-white border-4 border-black rounded-[3rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-6 border-b-4 border-black bg-zinc-50">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-6 w-6 text-[#2e8b57]" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      Manual Entry
                    </h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <form onSubmit={handleManualValidation} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="ticketId" className="text-lg font-black uppercase tracking-wider">
                        Ticket ID
                      </Label>
                      <Input
                        id="ticketId"
                        placeholder="Enter ticket ID"
                        value={manualTicketId}
                        onChange={(e) => setManualTicketId(e.target.value)}
                        className="h-16 border-4 border-black rounded-2xl text-lg px-6 focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={!manualTicketId.trim() || processing}
                      className="w-full bg-black text-white hover:bg-[#2e8b57] border-4 border-black rounded-2xl py-8 text-lg font-black uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        'Validate Ticket'
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}