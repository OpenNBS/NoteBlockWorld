export function Footer() {
  return (
    <footer className='w-full h-12 flex flex-row justify-center items-center bg-zinc-900 border-t border-zinc-700 p-2 z-10'>
      <div className='text-sm text-zinc-500'>
        <p>
          © {new Date().getFullYear()}{' '}
          <a href='https://opennbs.org/' className='underline'>
            OpenNBS
          </a>
        </p>
      </div>
    </footer>
  );
}
