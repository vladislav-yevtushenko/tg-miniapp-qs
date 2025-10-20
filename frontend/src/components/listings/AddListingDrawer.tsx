import { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  Field,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useTelegramContext } from "providers/telegramContext";
import { telegram } from "services/telegram";
import { PhotoPicker } from "components/photos/PhotoPicker";

interface AddListingDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MAX_PHOTOS = 5;

export const AddListingDrawer = ({ open, onClose }: AddListingDrawerProps) => {
  const { user } = useTelegramContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const contactLink = useMemo(() => {
    if (!user) {
      return "";
    }

    return user.username
      ? `https://t.me/${user.username}`
      : `tg://user?id=${user.id}`;
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setPhotos([]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (typeof telegram.showPopup === "function") {
      telegram.showPopup({
        message: "Listing submitted! Connect the backend to publish it.",
      });
    } else {
      window.alert("Listing submitted! Connect the backend to publish it.");
    }
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <DrawerRoot
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      placement="end"
      size="md"
    >
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent>
          <DrawerCloseTrigger />
          <DrawerHeader>Add new listing</DrawerHeader>
          <DrawerBody>
            <Stack
              as="form"
              id="add-listing-form"
              gap={5}
              onSubmit={handleSubmit}
            >
              <Field.Root>
                <Field.Label>Photos</Field.Label>
                <PhotoPicker
                  value={photos}
                  onChange={setPhotos}
                  maxPhotos={MAX_PHOTOS}
                  accept="image/*"
                  capture="environment"
                />
                <Field.HelperText>
                  {photos.length > 0
                    ? `Selected ${photos.length} photo${photos.length > 1 ? "s" : ""}`
                    : `Add up to ${MAX_PHOTOS} photos or capture new ones with your camera.`}
                </Field.HelperText>
              </Field.Root>
              <Field.Root required>
                <Field.Label>Item name</Field.Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  placeholder="Vintage backpack"
                />
              </Field.Root>
              <Field.Root required>
                <Field.Label>Description</Field.Label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  placeholder="Share details, condition, and delivery options."
                  rows={4}
                />
              </Field.Root>
              <Field.Root required>
                <Field.Label>Price</Field.Label>
                <Input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  placeholder="49.99"
                />
                <Field.HelperText>Use your local currency.</Field.HelperText>
              </Field.Root>
              <Field.Root required>
                <Field.Label>Contact via Telegram</Field.Label>
                <Input
                  value={contactLink}
                  isReadOnly
                  placeholder="Sign in to populate contact link"
                />
                <Field.HelperText>
                  {contactLink
                    ? "Share this link so buyers can reach you in Telegram."
                    : "Authorize with Telegram to populate your contact link."}
                </Field.HelperText>
              </Field.Root>
            </Stack>
          </DrawerBody>
          <DrawerFooter gap={3}>
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              type="submit"
              form="add-listing-form"
              isDisabled={!title || !description || !price || !contactLink}
            >
              Add listing
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
};
