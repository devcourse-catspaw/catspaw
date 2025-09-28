import * as AlertDialog from "@radix-ui/react-alert-dialog";

type AlertBoxProps = {
  title?: string;
  content: string;
  cancel: string;
  action: string;
  isOpen: boolean;
  onClose: () => void;
  cancelHandler?: () => void;
  actionHandler: () => void;
};

const AlertBox = ({
  title = "",
  content,
  cancel,
  action,
  isOpen,
  onClose,
  cancelHandler,
  actionHandler,
}: AlertBoxProps) => {
  const handleCancel = () => {
    cancelHandler?.();
    onClose();
  };

  const handleAction = () => {
    actionHandler();
    onClose();
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[320px] px-10 py-6 bg-white rounded-lg shadow-lg z-50 flex flex-col justify-center items-center">
          {title && (
            <AlertDialog.Title className="font-medium text-base text-[color:var(--black)] mb-2 text-center">
              {title}
            </AlertDialog.Title>
          )}
          <AlertDialog.Description className="font-normal text-sm text-[color:var(--black)] text-center mb-6">
            {content}
          </AlertDialog.Description>

          <div className="w-full flex flex-row justify-center items-center gap-4">
            <AlertDialog.Cancel
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border-0 bg-[#fbb4b4] text-white rounded transition-colors hover:scale-105 hover:bg-[#fbb4b4] duration-300 cursor-pointer"
            >
              {cancel}
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={handleAction}
              className="flex-1 px-4 py-2 border-0 bg-[color:var(--red)] text-white rounded transition-colors hover:scale-105 hover:bg-[color:var(--red)] duration-300 cursor-pointer"
            >
              {action}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AlertBox;
