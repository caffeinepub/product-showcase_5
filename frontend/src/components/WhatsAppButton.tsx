import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  productName: string;
  whatsappNumber: string;
}

export default function WhatsAppButton({ productName, whatsappNumber }: WhatsAppButtonProps) {
  const handleClick = () => {
    const message = encodeURIComponent(`Hi, I'm interested in ${productName}`);
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-whatsapp hover:bg-whatsapp/90 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <MessageCircle className="h-5 w-5" />
      <span>Contact on WhatsApp</span>
    </button>
  );
}
