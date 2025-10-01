import React from "react";

interface Item {
  id: number | string;
  title: string;
  subtitle?: string;
  image: string;
  type?: "plant" | "event" | "user" | "news";
}

interface SliderProps {
  title: string;
  items: Item[];
  cardHeight?: string;
  onClickItem?: (item: Item) => void;
}

export default function HorizontalSlider({
  title,
  items,
  cardHeight = "48",
  onClickItem,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-2">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 px-2 no-scrollbar">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => onClickItem?.(item)}
              className={`flex-shrink-0 w-64 md:w-72 h-${cardHeight} bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-2/3 object-cover"
              />
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 px-2">No hay resultados</p>
        )}
      </div>
    </div>
  );
}
