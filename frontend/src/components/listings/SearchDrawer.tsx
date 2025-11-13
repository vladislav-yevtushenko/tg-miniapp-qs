import { useState } from "react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  Input,
  Stack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { FaSearch, FaTimes } from "react-icons/fa";

type Props = {
  open: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  currentQuery: string;
};

export const SearchDrawer = ({
  open,
  onClose,
  onSearch,
  currentQuery,
}: Props) => {
  const [searchInput, setSearchInput] = useState(currentQuery);

  const handleSearch = () => {
    onSearch(searchInput.trim());
    onClose();
  };

  const handleClear = () => {
    setSearchInput("");
    onSearch("");
    onClose();
  };

  return (
    <DrawerRoot
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle>Search Listings</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Stack gap={4}>
            <Text fontSize="sm" color="fg.muted">
              Search by title or description
            </Text>
            <Input
              placeholder="Enter search term..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              size="lg"
              autoFocus
            />
            <Stack direction="row" gap={2}>
              <IconButton
                aria-label="Search"
                colorPalette="primary"
                onClick={handleSearch}
                flex={1}
              >
                <FaSearch /> Search
              </IconButton>
              {currentQuery && (
                <IconButton
                  aria-label="Clear search"
                  variant="outline"
                  onClick={handleClear}
                  flex={1}
                >
                  <FaTimes /> Clear
                </IconButton>
              )}
            </Stack>
            {currentQuery && (
              <Text fontSize="sm" color="fg.muted">
                Current search: <strong>{currentQuery}</strong>
              </Text>
            )}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};
