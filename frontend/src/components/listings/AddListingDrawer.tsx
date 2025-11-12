import { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
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
import { useCreateListing } from "@/hooks/useCreateListing";
import { useUploadPhotos } from "@/hooks/useUploadPhotos";

interface AddListingDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MAX_PHOTOS = 5;

export const AddListingDrawer = ({ open, onClose }: AddListingDrawerProps) => {
  const { user } = useTelegramContext();
  const createListing = useCreateListing();
  const uploadPhotos = useUploadPhotos();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Create listing
      const priceInMinorUnits = Math.round(parseFloat(price) * 100);
      const listing = await createListing.mutateAsync({
        title,
        description,
        price_minor_units: priceInMinorUnits,
        currency: "KZT", // Default currency
        category: null,
        condition: null,
      });

      // Step 2: Upload photos if any
      if (photos.length > 0) {
        await uploadPhotos.mutateAsync({
          listingId: listing.id,
          photos,
        });
      }

      // Success message
      if (typeof telegram.showPopup === "function") {
        telegram.showPopup({
          message:
            "Listing created! It will be visible after moderator approval.",
        });
      } else {
        window.alert(
          "Listing created! It will be visible after moderator approval."
        );
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create listing:", error);

      // Extract error message from API client error format
      let errorMessage = "Failed to create listing";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof telegram.showAlert === "function") {
        telegram.showAlert(errorMessage);
      } else {
        window.alert(errorMessage);
      }

      setIsSubmitting(false);
    }
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
          <DrawerBody>
            <Stack as="form" id="add-listing-form" onSubmit={handleSubmit}>
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
              <Field.Root>
                <PhotoPicker
                  value={photos}
                  onChange={setPhotos}
                  maxPhotos={MAX_PHOTOS}
                  accept="image/*"
                  capture="environment"
                />
                <Field.HelperText>
                  Add up to {MAX_PHOTOS} photos
                </Field.HelperText>
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
                  readOnly
                  placeholder="Cannot populate contact link"
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
              colorPalette="primary"
              type="submit"
              form="add-listing-form"
              disabled={
                !title || !description || !price || !contactLink || isSubmitting
              }
              loading={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Add listing"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
};
