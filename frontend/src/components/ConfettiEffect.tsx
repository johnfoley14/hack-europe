import { useEffect, useState } from 'react';

const colors = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const ConfettiEffect = () => {
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1.5,
        size: 4 + Math.random() * 8,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
