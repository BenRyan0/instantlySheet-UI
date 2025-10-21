import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DenyButton({ active, id, onDeny, setActive }) {
  const [open, setOpen] = useState(false); // controls modal visibility

  // 🔹 Show modal first
  const handleOpenModal = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  // 🔹 Run the actual deny logic after confirmation
  const handleConfirmDeny = async () => {
    try {
      const res = onDeny?.(active);
      if (res && res.then) await res; // supports async function
    } finally {
      setActive(null);
      setOpen(false); // close modal
    }
  };

  return (
    <>
      {/* Your existing button now just opens the modal */}
      <motion.button
        layoutId={`deny-${active.company}-${id}`}
        onClick={handleOpenModal}
        className="px-4 py-3 text-sm rounded-sm font-bold bg-red-400 text-white flex justify-start items-center gap-1 hover:bg-red-500 transition-all"
      >
        <FaChevronLeft /> Deny
      </motion.button>

      {/* Confirmation Modal */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Denial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deny <b>{active?.company}</b>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeny}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Deny
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
