import {
  Box,
  FileUpload,
  Float,
  Icon,
  useFileUploadContext,
} from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";
import type { FileUploadFileChangeDetails } from "@chakra-ui/react";
import { HiCamera } from "react-icons/hi";

interface PhotoPickerProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxPhotos?: number;
  accept?: string;
  capture?: "user" | "environment";
}

const DEFAULT_MAX_PHOTOS = 5;

const PhotoUploadSlots = ({ maxFiles }: { maxFiles: number }) => {
  return (
    <Box display="grid" gap={2}>
      <FileUpload.Dropzone>
        <FileUpload.DropzoneContent>
          <FileUpload.Trigger aChild>
            <HiCamera /> Open Camera
          </FileUpload.Trigger>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </Box>
  );
};

export const PhotoPicker = ({
  value,
  onChange,
  maxPhotos = DEFAULT_MAX_PHOTOS,
  accept = "image/*",
  capture = "environment",
}: PhotoPickerProps) => {
  const handleFileChange = ({ acceptedFiles }: FileUploadFileChangeDetails) => {
    onChange(acceptedFiles);
  };

  return (
    <FileUpload.Root
      accept={accept}
      capture={capture}
      maxFiles={maxPhotos}
      acceptedFiles={value}
      onFileChange={handleFileChange}
    >
      <FileUpload.HiddenInput />
      <PhotoUploadSlots maxFiles={maxPhotos} />
    </FileUpload.Root>
  );
};
