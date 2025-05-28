
import { useToast } from '@/hooks/use-toast';

export const useScreenCapture = () => {
  const { toast } = useToast();

  const captureScreen = async () => {
    try {
      // Use html2canvas directly to capture the entire page
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(document.body, {
        height: window.innerHeight,
        width: window.innerWidth,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        allowTaint: true
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
    } catch (error) {
      console.error('Error capturing screen:', error);
      toast({
        title: "Erro na captura",
        description: "Não foi possível capturar a tela.",
        variant: "destructive",
      });
    }
  };

  return { captureScreen };
};
