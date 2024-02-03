import { LoggedUserData } from '@web/src/modules/auth/types/User';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { PopoverArrow } from '@radix-ui/react-popover';

function UserMenuButton({ userData }: { userData: LoggedUserData }) {
  return (
    <>
      <button className='h-8 w-8 relative'>
        <img
          src='/bentroen.png'
          className='absolute top-0 left-0 h-full w-full rounded-full'
        />
        <div className='absolute top-0 left-0 h-full w-full bg-black rounded-full opacity-0 hover:opacity-30 transition-opacity duration-150'></div>
      </button>
    </>
  );
}

export function UserMenu({ userData }: { userData: LoggedUserData }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <UserMenuButton userData={userData} />
      </PopoverTrigger>
      <PopoverContent
        className='w-80'
        sideOffset={10}
        align='end'
        alignOffset={-10}
      >
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Dimensions</h4>
            <p className='text-sm text-muted-foreground'>
              Set the dimensions for the layer.
            </p>
          </div>
          <div className='grid gap-2'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='width'>Width</label>
              <input
                id='width'
                defaultValue='100%'
                className='col-span-2 h-8'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='maxWidth'>Max. width</label>
              <input
                id='maxWidth'
                defaultValue='300px'
                className='col-span-2 h-8'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='height'>Height</label>
              <input
                id='height'
                defaultValue='25px'
                className='col-span-2 h-8'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='maxHeight'>Max. height</label>
              <input
                id='maxHeight'
                defaultValue='none'
                className='col-span-2 h-8'
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
