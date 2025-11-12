import { Box, Button, Heading, Stack, Text, HStack, VStack } from "@chakra-ui/react";
import { ColorModeButton, useColorMode } from "components/ui/color-mode";

/**
 * Example component demonstrating the custom theme usage
 * This component showcases various theme features including:
 * - Light/Dark mode switching
 * - Custom color palette (primary)
 * - Text styles
 * - Layer styles
 * - Semantic tokens
 */
export function ThemeExample() {
  const { colorMode } = useColorMode();
  
  return (
    <VStack gap={6} align="stretch" p={4}>
      <Box>
        <Heading size="lg" mb={4}>
          Theme Examples
        </Heading>
        <HStack gap={2} align="center">
          <Text>Current mode: <strong>{colorMode}</strong></Text>
          <ColorModeButton />
        </HStack>
      </Box>

      {/* Color Palettes */}
      <Box layerStyle="card">
        <Heading size="md" mb={3}>
          Primary Color Palette
        </Heading>
        <Stack gap={3}>
          <HStack gap={2}>
            <Button colorPalette="primary" size="md">
              Primary Button
            </Button>
            <Button colorPalette="blue" size="md">
              Default Blue
            </Button>
            <Button colorPalette="green" size="md">
              Default Green
            </Button>
          </HStack>
          
          <HStack gap={2}>
            <Button colorPalette="primary" variant="outline">
              Primary Outline
            </Button>
            <Button colorPalette="blue" variant="outline">
              Blue Outline
            </Button>
          </HStack>

          <HStack gap={2}>
            <Button colorPalette="primary" variant="ghost">
              Primary Ghost
            </Button>
            <Button colorPalette="blue" variant="ghost">
              Blue Ghost
            </Button>
          </HStack>
        </Stack>
      </Box>

      {/* Text Styles */}
      <Box layerStyle="card">
        <Heading size="md" mb={3}>
          Text Styles
        </Heading>
        <VStack align="start" gap={2}>
          <Text textStyle="heading" fontSize="2xl">
            Heading Text Style
          </Text>
          <Text textStyle="subheading" fontSize="lg">
            Subheading Text Style
          </Text>
          <Text textStyle="body">
            Body text style with comfortable line height for reading longer content.
          </Text>
        </VStack>
      </Box>

      {/* Layer Styles */}
      <Box layerStyle="card">
        <Heading size="md" mb={3}>
          Layer Styles
        </Heading>
        <VStack gap={3} align="stretch">
          <Box layerStyle="card">
            <Text>Standard Card Layer Style</Text>
          </Box>
          <Box layerStyle="cardHover">
            <Text>Hoverable Card Layer Style (try hovering!)</Text>
          </Box>
        </VStack>
      </Box>

      {/* Semantic Tokens */}
      <Box layerStyle="card">
        <Heading size="md" mb={3}>
          Semantic Tokens (Auto Light/Dark)
        </Heading>
        <VStack gap={2} align="stretch">
          <Box bg="primary.muted" p={3} borderRadius="md">
            <Text color="primary.fg">Primary Muted Background</Text>
          </Box>
          <Box bg="primary.subtle" p={3} borderRadius="md">
            <Text color="primary.fg">Primary Subtle Background</Text>
          </Box>
          <Box bg="bg.subtle" p={3} borderRadius="md" borderWidth="1px" borderColor="border.subtle">
            <Text color="fg">Default Background (bg.subtle)</Text>
          </Box>
          <Box bg="bg.panel" p={3} borderRadius="md" borderWidth="1px" borderColor="border.subtle">
            <Text color="fg.muted">Panel Background (bg.panel)</Text>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
}
