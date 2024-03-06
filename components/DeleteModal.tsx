import { db, storage } from "@/Firebase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useToast } from "@/components/ui/use-toast";

export function DeleteModal() {
  const { user } = useUser();
  const { toast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen, fileId, setFileId] =
    useAppStore((state) => [
      state.isDeleteModalOpen,
      state.setIsDeleteModalOpen,
      state.fileId,
      state.setFileId,
    ]);

  async function deleteFile() {
    if (!user || !fileId) return;
    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);

    try {
      deleteObject(fileRef)
        .then(async () => {
          console.log("file deleted");
          deleteDoc(doc(db, "users", user.id, "files", fileId)).then(() => {
            console.log("deleted from firestore");
          });
        })
        .finally(() => {
          toast({
            description: "Deleted Successfully.",
          });
          setIsDeleteModalOpen(false);
        });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem with your request. Couldn't Delete your file.",
      });
      console.log(error);
    }
  }

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. this will permanently delete your
            file!
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant={"ghost"}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <span>cancel</span>
          </Button>
          <Button
            type="submit"
            size="sm"
            variant={"destructive"}
            className="px-3 flex-1"
            onClick={() => {
              toast({
                description: "Deleting...",
              });
              deleteFile();
            }}
          >
            <span>Delete</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
