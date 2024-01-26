interface TimespanButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  isDisabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
}

export const TimespanButton = ({
  isActive,
  isDisabled,
  onClick,
  children,
  id,
}: TimespanButtonProps) => {
  return (
    <div>
      <button
        id={id}
        onClick={onClick}
        className={
          (isActive
            ? 'enabled:bg-white enabled:text-black cursor-default enabled:font-bold'
            : 'enabled:bg-zinc-600 enabled:text-white enabled:cursor-pointer hover:enabled:bg-zinc-500') +
          ' disabled:bg-zinc-700 disabled:text-zinc-500 whitespace-nowrap text-sm py-1 px-2 w-24 rounded-full transition-all duration-200'
        }
        disabled={isDisabled}
      >
        {children}
      </button>
    </div>
  );
};
