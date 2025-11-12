import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#e6f3ff" },
          100: { value: "#cce7ff" },
          200: { value: "#99cfff" },
          300: { value: "#66b7ff" },
          400: { value: "#339fff" },
          500: { value: "#0088ff" },
          600: { value: "#006dcc" },
          700: { value: "#005299" },
          800: { value: "#003766" },
          900: { value: "#001b33" },
          950: { value: "#000d1a" },
        },
      },
      fonts: {
        heading: { value: "system-ui, -apple-system, sans-serif" },
        body: { value: "system-ui, -apple-system, sans-serif" },
      },
      radii: {
        sm: { value: "0.25rem" },
        md: { value: "0.5rem" },
        lg: { value: "0.75rem" },
        xl: { value: "1rem" },
        "2xl": { value: "1.5rem" },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          solid: { value: "{colors.primary.500}" },
          contrast: { value: "white" },
          fg: {
            value: {
              _light: "{colors.primary.700}",
              _dark: "{colors.primary.300}",
            },
          },
          muted: {
            value: {
              _light: "{colors.primary.100}",
              _dark: "{colors.primary.900}",
            },
          },
          subtle: {
            value: {
              _light: "{colors.primary.200}",
              _dark: "{colors.primary.800}",
            },
          },
          emphasized: {
            value: {
              _light: "{colors.primary.300}",
              _dark: "{colors.primary.700}",
            },
          },
          focusRing: { value: "{colors.primary.500}" },
        },
      },
    },
    textStyles: {
      heading: {
        value: {
          fontWeight: "bold",
          lineHeight: "1.2",
        },
      },
      subheading: {
        value: {
          fontWeight: "semibold",
          lineHeight: "1.4",
        },
      },
      body: {
        value: {
          fontWeight: "normal",
          lineHeight: "1.6",
        },
      },
    },
    layerStyles: {
      card: {
        value: {
          bg: "bg.panel",
          borderRadius: "lg",
          borderWidth: "1px",
          borderColor: "border.subtle",
          padding: "4",
          shadow: "sm",
        },
      },
      cardHover: {
        value: {
          bg: "bg.panel",
          borderRadius: "lg",
          borderWidth: "1px",
          borderColor: "border.subtle",
          padding: "4",
          shadow: "sm",
          transition: "all 0.2s",
          _hover: {
            shadow: "md",
            borderColor: "border.emphasized",
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
