import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMusic } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const SplitHR = styled.hr.attrs({
  className: "border-zinc-200 dark:border-zinc-700 my-4",
})``;

const MenuList = styled.ul.attrs({
  className: "",
})``;

const MenuItem = styled.li.attrs({
  className:
    "flex items-center p-2 rounded-lg text-white hover:bg-zinc-800 cursor-pointer",
})``;

type TSidebarProps = {
  toggle: () => void;
};

const Sidebar = ({ toggle }: TSidebarProps) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center p-2 mr-3">
        <div className="col col-span-1">
          <button
            className="flex items-center px-3 py-2 rounded text-white"
            onClick={toggle}
          >
            <FontAwesomeIcon icon={faBars} size="2x" />
          </button>
        </div>
        <div className="col col-span-2">
          <figure>
            <img
              src="/nbw-white.png"
              alt="NoteBlockWorld logo"
              className="h-10 mx-auto my-2"
            />
          </figure>
        </div>
      </div>
      <hr className="border-zinc-200 dark:border-zinc-800" />
      <div className="flex flex-col h-full justify-between p-3">
        <div>
          <MenuList>
            <Link href="/dashboard">
              <MenuItem>
                <FontAwesomeIcon icon={faMusic} size="lg" className="pr-3" />
                Open Note Block Studio
              </MenuItem>
            </Link>
          </MenuList>
        </div>
        <div>
          <SplitHR />

          {/* User info */}
          {true && ( // TODO: replace with "session"
            <div className="space-y-2">
              <div className="flex flex-row gap-2 items-center p-2 text-base text-white font-normal rounded-lg">
                <picture>
                  <img
                    className="flex-none w-[2.5rem] min-w-[2.5rem] rounded-full"
                    src="/vercel.json"
                    alt=""
                  />
                </picture>
                <div className="leading-tight">
                  <span className="font-semibold">Note Block World</span>

                  <p className="text-xs text-zinc-400">
                    opennbs@example.com
                    <br />(
                    <a
                      onClick={() => console.log("Signing out")}
                      className="underline text-zinc-400 hover:text-zinc-300 hover:cursor-pointer"
                    >
                      sign out
                    </a>
                    )
                  </p>
                </div>
              </div>
            </div>
          )}
          <SplitHR />
          <div className="text-xs text-center text-zinc-500">
            <p>
              © 2023 OpenNBS |{" "}
              <Link
                href="/privacy"
                className="text-xs text-zinc-500 hover:text-zinc-400 underline hover:cursor-pointer"
              >
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
