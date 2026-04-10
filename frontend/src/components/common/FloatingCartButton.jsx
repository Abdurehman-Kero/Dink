import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FloatingCartButton() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem('checkoutReservations');
      if (saved) {
        const items = JSON.parse(saved);
        setItemCount(items.length);
      } else {
        setItemCount(0);
      }
    };
    
    updateCount();
    // Listen for storage changes
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  if (itemCount === 0) return null;

  return (
    <Link
      to="/saved-tickets"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full p-4 shadow-lg hover:from-green-700 hover:to-green-800 transition-all group"
    >
      <div className="relative">
        <ShoppingBag className="size-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      </div>
    </Link>
  );
}
