import type { Dispatch, FC, PropsWithChildren, ReactNode, SetStateAction } from "react";
import { Fragment, useRef } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import clsx from "clsx";

interface DialogProps extends PropsWithChildren {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  icon: ReactNode;
  title: ReactNode;
  actions?: ReactNode;
  inline?: boolean;
  className?: string;
}

const Dialog: FC<DialogProps> = ({ open, setOpen, ...props }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/80 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className={clsx(
              "flex min-h-full items-center justify-center p-4 text-center",
              props.inline || "sm:p-0"
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialog.Panel
                className={clsx(
                  "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all",
                  props.inline || "sm:my-8 sm:w-full sm:max-w-lg",
                  props.className
                )}
              >
                <HeadlessDialog.Title
                  as="h3"
                  className="flex flex-row items-start px-4 py-3 font-semibold leading-6 text-gray-700"
                >
                  {props.title}
                </HeadlessDialog.Title>
                <div className={clsx("bg-white px-4 pb-4 pt-5", props.inline || "sm:p-6 sm:pb-4")}>
                  <div className={clsx(props.inline || "sm:flex sm:items-start")}>
                    <div
                      className={clsx(
                        "mx-auto flex flex-shrink-0 items-center justify-center",
                        props.inline || "sm:mx-0 sm:h-10 sm:w-10"
                      )}
                    >
                      {props.icon}
                    </div>
                    <div
                      className={clsx(
                        "mt-3 text-center",
                        props.inline || "sm:ml-4 sm:mt-0 sm:text-left"
                      )}
                    >
                      <div className="mt-2">{props.children}</div>
                    </div>
                  </div>
                </div>
                <div
                  className={clsx(
                    props.inline || "sm:flex sm:flex-row-reverse sm:px-6",
                    props.inline && "flex flex-col gap-2 bg-gray-100 p-4"
                  )}
                >
                  {props.actions}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  );
};

export default Dialog;
