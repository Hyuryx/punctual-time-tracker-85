
import { useToast } from '@/hooks/use-toast';

export const useScreenCapture = () => {
  const { toast } = useToast();

  const captureScreen = async () => {
    try {
      // Try to use the modern Screen Capture API if available
      if ('getDisplayMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: false
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              
              // Stop the stream
              stream.getTracks().forEach(track => track.stop());
              
              // Convert to blob and download
              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `captura-tela-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "Captura realizada!",
                    description: "A imagem da tela foi salva com sucesso.",
                  });
                }
                resolve(blob);
              });
            }
          };
        });
      } else {
        // Fallback: capture using html2canvas
        const { default: html2canvas } = await import('html2canvas');
        
        const canvas = await html2canvas(document.body, {
          height: window.innerHeight,
          width: window.innerWidth,
          scrollX: 0,
          scrollY: 0
        });
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `captura-tela-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Captura realizada!",
              description: "A imagem da tela foi salva com sucesso.",
            });
          }
        });
      }
    } catch (error) {
      console.error('Error capturing screen:', error);
      toast({
        title: "Erro na captura",
        description: "Não foi possível capturar a tela. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  return { captureScreen };
};
