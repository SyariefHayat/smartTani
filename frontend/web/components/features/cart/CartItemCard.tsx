'use client';

import { ICartItem } from '@/services/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingBag, Plus, Minus, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface CartItemCardProps {
  item: ICartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating: boolean;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemCardProps) {
  return (
    <Card className={`overflow-hidden ${!item.isAvailable ? 'opacity-60 bg-gray-50' : ''}`}>
      <CardContent className="p-4 flex gap-4">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0 bg-gray-50">
          {item.image ? (
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-500">
                Rp {item.price_per_unit.toLocaleString('id-ID')} / {item.unit}
              </p>
              {!item.isAvailable && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {item.reason}
                </p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-red-500 -mt-1 -mr-2"
              onClick={() => onRemove(item.productId)}
              disabled={isUpdating}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-between items-end">
            <p className="font-bold text-green-600">
              Rp {item.subtotal.toLocaleString('id-ID')}
            </p>
            
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button 
                className="p-1 hover:bg-gray-100 disabled:opacity-30"
                onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button 
                className="p-1 hover:bg-gray-100 disabled:opacity-30"
                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
