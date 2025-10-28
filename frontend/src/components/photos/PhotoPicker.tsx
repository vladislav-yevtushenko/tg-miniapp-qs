import {
  Box,
  Button,
  FileUpload,
  Float,
  Icon,
  useFileUploadContext,
} from "@chakra-ui/react";
import type { FileUploadFileChangeDetails } from "@chakra-ui/react";
import { HiCamera } from "react-icons/hi";
import { LuX } from "react-icons/lu";

interface PhotoPickerProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxPhotos?: number;
  accept?: string;
  capture?: "user" | "environment";
}

const DEFAULT_MAX_PHOTOS = 5;

const FileUploadList = () => {
  const fileUpload = useFileUploadContext();
  const files = fileUpload.acceptedFiles;
  if (files.length === 0) return null;
  return (
    <FileUpload.ItemGroup boxSize="20">
      {files.map((file) => (
        <FileUpload.Item file={file} key={file.name}>
          <FileUpload.ItemPreviewImage />
          <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
              <LuX />
            </FileUpload.ItemDeleteTrigger>
          </Float>
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  );
};

export const PhotoPicker = ({
  value,
  onChange,
  maxPhotos = DEFAULT_MAX_PHOTOS,
  accept = "image/*",
  capture = "user",
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
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="md">
          <HiCamera />
          Add Photos
        </Button>
      </FileUpload.Trigger>
      <FileUploadList />
    </FileUpload.Root>
  );
};
