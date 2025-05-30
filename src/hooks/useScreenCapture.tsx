
import { useToast } from '@/hooks/use-toast';

export const useScreenCapture = () => {
  const { toast } = useToast();

  const captureScreen = async () => {
    try {
      // Use html2canvas to capture the entire page
      const { default: html2canvas } = await import('html2canvas');
      
      // Get the full document height including scrollable content
      const body = document.body;
      const html = document.documentElement;
      const fullHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      
      const canvas = await html2canvas(document.body, {
        height: fullHeight,
        width: window.innerWidth,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false,
        backgroundColor: '#ffffff'
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
            description: "A imagem da página completa foi salva com sucesso.",
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
