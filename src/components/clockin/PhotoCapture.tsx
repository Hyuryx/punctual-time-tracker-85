
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, RotateCcw, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken: (photoData: string) => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ isOpen, onClose, onPhotoTaken }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  }, [capturedPhoto, onPhotoTaken, onClose]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedPhoto(null);
    onClose();
  }, [stopCamera, onClose]);

  React.useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedPhoto, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Registro com Foto</DialogTitle>
          <DialogDescription>
            Tire uma foto para confirmar seu registro de ponto
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {isStreaming && (
                    <div className="absolute inset-0 border-4 border-primary rounded-lg animate-pulse" />
                  )}
                </>
              ) : (
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex justify-center gap-2 mt-4">
              {!capturedPhoto ? (
                <Button
                  onClick={capturePhoto}
                  disabled={!isStreaming}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capturar Foto
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Refazer
                  </Button>
                  <Button
                    onClick={confirmPhoto}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full mt-2"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
