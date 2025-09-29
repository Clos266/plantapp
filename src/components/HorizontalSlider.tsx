function HorizontalSlider({ title, items, cardHeight = "12rem" }: SliderProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-2">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 px-2 no-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-64 md:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            style={{ height: cardHeight }}
          >
            <div className="h-2/3 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 h-1/3 flex flex-col justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                {item.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-xs">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
