"use client";
import { db, storage } from "@/Firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import DropzoneComponent from "react-dropzone";
import { useToast } from "@/components/ui/use-toast";

function Dropzone() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // get the user state
  const { isLoaded, isSignedIn, user } = useUser();

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("File reading was aborted");
      reader.onerror = () => console.log("File reading was failed");
      reader.onload = async () => {
        await uploadPost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadPost = async (selectedFile: File) => {
    // stops from uploading multiple versions of the file incase of spamming the upload button
    if (loading) return;
    if (!user) return;
    setLoading(true);
    toast({
      description: "Uploading...",
    });

    try {
      //upload the file
      // adding document to this path -> users/userID/files
      const docRef = await addDoc(collection(db, "users", user.id, "files"), {
        userID: user.id,
        filename: selectedFile.name,
        fullName: user.fullName,
        profileImg: user.imageUrl,
        timestamp: serverTimestamp(),
        type: selectedFile.type,
        size: selectedFile.size,
      });

      const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);
      uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
          downloadURL: downloadURL,
        });
      });
      setLoading(false);
      toast({
        description: "Uploaded Successfully.",
      });
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem with your request. Couldn't Upload your file.",
      });
    }
  };

  const maxfileSize = 20971520;
  return (
    <div>
      <DropzoneComponent minSize={0} maxSize={maxfileSize} onDrop={onDrop}>
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          fileRejections,
        }) => {
          const isFileTooLarge =
            fileRejections.length > 0 &&
            fileRejections[0].file.size > maxfileSize;
          return (
            <section className="m-4 cursor-pointer">
              <div
                {...getRootProps()}
                className={cn(
                  "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                  isDragActive
                    ? "bg-[#035FFE] text-white animate-pulse"
                    : " bg-slate-100/50 dark:bg-slate-800/80 text-slate-400 "
                )}
              >
                <input {...getInputProps()} />
                {!isDragActive && "click here or drop a file to upload!"}
                {isDragActive && !isDragReject && "Drop to upload this file!"}
                {isDragReject && "File type not Accepted!"}
                {isFileTooLarge && (
                  <div className="text-danger mt-2">File too large</div>
                )}
              </div>
            </section>
          );
        }}
      </DropzoneComponent>
    </div>
  );
}

export default Dropzone;
