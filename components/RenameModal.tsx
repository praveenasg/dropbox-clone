"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/Firebase";
import { useToast } from "@/components/ui/use-toast";

function RenameModal() {
  const { toast } = useToast();
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen, fileId, filename] =
    useAppStore((state) => [
      state.isRenameModalOpen,
      state.setIsRenameModalOpen,
      state.fileId,
      state.filename,
    ]);

  const renameFile = async () => {
    if (!user || !fileId) return;
    try {
      await updateDoc(doc(db, "users", user.id, "files", fileId), {
        filename: input,
      });
      toast({
        description: "Rename Complete.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
    setInput("");
    setIsRenameModalOpen(false);
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModalOpen(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">Rename The File</DialogTitle>
          <Input
            id="link"
            defaultValue={filename}
            onChange={(e) => setInput(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                renameFile();
              }
            }}
          />
          <div className="flex justify-end space-x-2 py-3">
            <Button
              size="sm"
              className="px-3"
              variant={"ghost"}
              onClick={() => setIsRenameModalOpen(false)}
            >
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={() => {
                toast({
                  description: "Renaming...",
                });
                renameFile();
              }}
            >
              <span>Rename</span>
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default RenameModal;
